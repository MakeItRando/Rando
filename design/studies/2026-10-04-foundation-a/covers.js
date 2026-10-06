// Code-native placeholder art for a design study only. Not product assets.
const ART={
 night:{bg:['#0b1030','#2a0f3d'],blobs:[['#ff3d8b',.30,.72,.42],['#2de2e6',.78,.30,.30],['#6b5bff',.55,.55,.35]],mark:'rain'},
 silver:{bg:['#1d2430','#5d6b7d'],blobs:[['#e8edf2',.70,.28,.30],['#9fb3c8',.25,.75,.40]],mark:'horizon'},
 cont:{bg:['#2b0d05','#7a2a0c'],blobs:[['#ffb067',.35,.40,.45],['#ff5a2a',.72,.70,.35]],mark:'ring'},
 blue:{bg:['#06142b','#0f3a66'],blobs:[['#7cc4ff',.5,.62,.42],['#f5b7c8',.62,.82,.22]],mark:'horizon'},
 open:{bg:['#05140f','#0c3b2b'],blobs:[['#38f2a0',.30,.30,.30],['#c6ff6b',.75,.65,.22]],mark:'bars'},
 first:{bg:['#2a1a05','#6b4a12'],blobs:[['#ffd36b',.62,.38,.42],['#ff8a5b',.30,.78,.30]],mark:'sun'},
 small:{bg:['#1a0606','#4a0f14'],blobs:[['#ff4d5e',.30,.62,.38],['#f6c26b',.72,.30,.24]],mark:'ring'},
 soft:{bg:['#120a24','#35206b'],blobs:[['#c59bff',.40,.35,.40],['#ff9ad5',.70,.75,.30]],mark:'bars'},
 north:{bg:['#0d1416','#26393c'],blobs:[['#a7e0dc',.65,.35,.38],['#3e7c80',.25,.70,.40]],mark:'sun'},
 margins:{bg:['#151515','#3a3a3a'],blobs:[['#f2f2f2',.30,.30,.22],['#ff6b4a',.72,.72,.20]],mark:'rain'},
};
function coverURI(k){const a=ART[k];let b='';let d='';a.blobs.forEach(([c,x,y,r],i)=>{d+=`<radialGradient id="r${i}"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset=".55" stop-color="${c}" stop-opacity=".45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;b+=`<circle cx="${x*400}" cy="${y*400}" r="${r*560}" fill="url(#r${i})"/>`});
 let m='';
 if(a.mark==='ring')m=`<circle cx="200" cy="200" r="118" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/><circle cx="200" cy="200" r="4" fill="#fff"/>`;
 if(a.mark==='horizon')m=`<rect x="0" y="262" width="400" height="138" fill="rgba(0,0,0,.28)"/><line x1="0" y1="262" x2="400" y2="262" stroke="rgba(255,255,255,.35)"/>`;
 if(a.mark==='sun')m=`<circle cx="200" cy="232" r="70" fill="rgba(255,255,255,.18)"/>`;
 if(a.mark==='bars'){for(let i=0;i<9;i++){const h=40+((i*53)%140);m+=`<rect x="${60+i*32}" y="${300-h}" width="6" height="${h}" rx="3" fill="rgba(255,255,255,.35)"/>`}}
 if(a.mark==='rain'){for(let i=0;i<26;i++){const x=(i*61)%400,y=(i*97)%400;m+=`<line x1="${x}" y1="${y}" x2="${x-10}" y2="${y+46}" stroke="rgba(255,255,255,.22)" stroke-width="1"/>`}}
 const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a.bg[0]}"/><stop offset="1" stop-color="${a.bg[1]}"/></linearGradient>${d}<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0"/></filter></defs><rect width="400" height="400" fill="url(#g)"/>${b}${m}<rect width="400" height="400" filter="url(#n)"/></svg>`;
 return 'url("data:image/svg+xml;utf8,'+encodeURIComponent(s)+'")';}
document.querySelectorAll('[data-art]').forEach(e=>e.style.backgroundImage=coverURI(e.dataset.art));
