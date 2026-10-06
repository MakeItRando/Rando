// Flat placeholder sleeves for a design study only. Not product assets.
const C={
 night:['#1d2a44','#e8e2d4','circle-off'], silver:['#cfd2cc','#1a1a1a','stripes'], cont:['#b8471f','#f1e6d2','half'],
 blue:['#2c4a7a','#e9e4d8','arc'], open:['#3f4a2f','#d9d2b6','dots'], first:['#e6dcc4','#b8471f','sun'],
 small:['#5a1f1f','#e8dccb','bars'], soft:['#8f8a80','#141414','grid'], north:['#26343a','#cfd8d4','line'], margins:['#efeae0','#141414','square']};
function svg(k){const [b,f,t]=C[k];let g='';
 if(t==='circle-off')g=`<circle cx="250" cy="170" r="110" fill="${f}"/><circle cx="250" cy="170" r="110" fill="none"/>`;
 if(t==='stripes')for(let i=0;i<10;i++)g+=`<rect x="0" y="${40+i*34}" width="400" height="${4+i*1.6}" fill="${f}"/>`;
 if(t==='half')g=`<rect x="0" y="200" width="400" height="200" fill="${f}"/><circle cx="200" cy="200" r="90" fill="${b}"/><rect x="110" y="200" width="180" height="90" fill="${f}"/>`;
 if(t==='arc')g=`<path d="M60 340 A140 140 0 0 1 340 340" fill="none" stroke="${f}" stroke-width="22"/><path d="M110 340 A90 90 0 0 1 290 340" fill="none" stroke="${f}" stroke-width="8"/>`;
 if(t==='dots')for(let y=0;y<7;y++)for(let x=0;x<7;x++)g+=`<circle cx="${80+x*40}" cy="${80+y*40}" r="${(x+y)%3?5:13}" fill="${f}"/>`;
 if(t==='sun')g=`<circle cx="200" cy="230" r="120" fill="${f}"/><rect x="0" y="230" width="400" height="170" fill="${b}"/><rect x="40" y="250" width="320" height="6" fill="${f}"/>`;
 if(t==='bars')[60,140,90,220,170,260,120,200,80].forEach((h,i)=>g+=`<rect x="${52+i*34}" y="${330-h}" width="18" height="${h}" fill="${f}"/>`);
 if(t==='grid')for(let i=0;i<4;i++)for(let j=0;j<4;j++)g+=`<rect x="${60+i*72}" y="${60+j*72}" width="64" height="64" fill="${(i*j)%3===1?f:'none'}" stroke="${f}" stroke-width="3"/>`;
 if(t==='line')g=`<rect x="60" y="0" width="3" height="400" fill="${f}"/><circle cx="61.5" cy="140" r="16" fill="${f}"/><rect x="0" y="300" width="400" height="3" fill="${f}"/>`;
 if(t==='square')g=`<rect x="90" y="90" width="220" height="220" fill="${f}"/><rect x="230" y="230" width="80" height="80" fill="#b8471f"/>`;
 return `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="${b}"/>${g}</svg>`}
document.querySelectorAll('[data-art]').forEach(e=>e.innerHTML=svg(e.dataset.art));
function wave(el,n,played){let s='';for(let i=0;i<n;i++){const v=.25+.75*Math.abs(Math.sin(i*.37)*Math.cos(i*.11+1)+.25*Math.sin(i*1.7));s+=`<i style="height:${Math.max(12,Math.min(100,v*100))}%;background:${i/n<played?'var(--t1)':'#3a3a3a'}"></i>`}el.innerHTML=s}
document.querySelectorAll('[data-wave]').forEach(e=>wave(e,+e.dataset.wave,+e.dataset.played));
