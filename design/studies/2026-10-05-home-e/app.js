const $=id=>document.getElementById(id);
const ICON=k=>`<svg class="ic${k==='play'||k==='pause'?' f':''}" viewBox="0 0 24 24">${I[k]}</svg>`;
const st={src:'late',i:0,t:0,on:false,liked:new Set(['night','blue','s1']),pl:{late:SRC.late.q.slice(),sunday:SRC.sunday.q.slice(),focus:SRC.focus.q.slice()},jHeard:new Set()};
st.uq=[];st.uqNow=null;
const curK=()=>st.uqNow||SRC[st.src].q[st.i];const cur=()=>S[curK()];
const SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',MOON='<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>';
/* waveform */
const N=120;$('wv').innerHTML=Array.from({length:N},(_,i)=>{const v=.25+.75*Math.abs(Math.sin(i*.37)*Math.cos(i*.11+1)+.25*Math.sin(i*1.7));return `<i style="height:${Math.max(12,Math.min(100,v*100))}%"></i>`}).join('');const bars=[...$('wv').children];
/* static builds */
function buildSide(){$('pls').innerHTML=[['liked','Liked songs'],['late'],['sunday'],['focus']].map(([k])=>{const s=SRC[k];const n=k==='liked'?st.liked.size+45:st.pl[k].length;const art=k==='liked'?`<span class="liked">${ICON('heart').replace('class="ic"','class="ic f" style="width:15px;height:15px"')}</span>`:`<span class="cover" data-art="${s.art}">${svg(s.art)}</span>`;return `<button class="li" data-src="${k}">${art}<div><b>${s.name}</b><span>${n} songs</span></div><span class="eq"><i></i><i></i><i></i></span></button>`}).join('')}
const ART=['cont','margins','night','small','north','open','first'],NAMES=['Asha North','Dax Moreno','Kairo Vale','Moni Gray','Nia Vale','Sora K','Theo June'],CNT=[12,9,20,6,11,16,14];
function buildPath(){const p=$('path');p.querySelectorAll('.node').forEach(n=>n.remove());NAMES.forEach((n,i)=>{const c=i<3?'d':i===3?'c':'l';const el=document.createElement('button');el.className='node '+c;el.innerHTML=`<span class="av2"><span class="cover">${svg(ART[i])}</span>${c==='d'?`<span class="chk">${ICON('check')}</span>`:''}${c==='c'?`<svg class="ring" viewBox="0 0 74 74"><circle class="bg" cx="37" cy="37" r="35"/><circle class="fg" id="ringFg" cx="37" cy="37" r="35" stroke-dasharray="220" stroke-dashoffset="220"/></svg><span class="ov"><span class="eq"><i></i><i></i><i></i></span></span>`:''}</span><b>${n}</b><span class="m" ${c==='c'?'id="curNodeM"':''}>${c==='d'?CNT[i]+' songs':c==='c'?'Next':CNT[i]+' songs'}</span>`;if(c==='c')el.dataset.src='journey';p.appendChild(el)})}
function buildChart(){const v=[48,66,30,78,58,100,44],d=['M','T','W','T','F','S','S'];$('chart').innerHTML=v.map((x,i)=>`<div class="${i===6?'td':''}"><i style="height:${x}%;animation-delay:${.3+i*.05}s"></i><span>${d[i]}</span></div>`).join('')}
function buildRepeat(){$('repeat').innerHTML=SRC.repeat.q.map((k,i)=>{const s=S[k];return `<button class="it" data-src="repeat" data-i="${i}" data-k="${k}"><div class="wrap"><span class="cover">${svg(s.art)}</span><span class="cnt m">×${REPEAT_COUNT[k]}</span><span class="pb"></span></div><b>${s.t}</b><span class="s">${s.a}</span></button>`}).join('')}
const MOODS=[['mood_night','#1e2b4a',['night','blue']],['mood_gym','#b8471f',['margins','open']],['mood_focus','#3f4a2f',['open','first']],['mood_chill','#2c4a7a',['blue','soft']],['mood_sad','#3d3a52',['north','s3']],['mood_party','#7a1f3a',['margins','m4']]];
function buildMoods(){$('moods').innerHTML=MOODS.map(([k,c,a])=>`<button class="md" data-src="${k}" style="background:${c}"><span class="stk">${a.map(x=>`<span class="cover">${svg(S[x].art)}</span>`).join('')}</span>${SRC[k].name}</button>`).join('')}
const RELS=[['silver','EP · 2d ago',1],['soft','Single · 5d ago',1],['north','Album · Sep 18'],['margins','Single · Sep 2'],['opens','Single · Aug 21'],['first','Single · Aug 9']];
function buildRels(){$('rels').innerHTML=RELS.map(([k,m,n])=>{const s=SRC[k];return `<button class="it" data-src="${k}" data-i="0"><div class="wrap"><span class="cover">${svg(s.art)}</span><span class="pb"></span></div><b>${s.name}</b><span class="s">${S[s.q[0]].ar}</span><span class="m${n?' n':''}">${m}</span></button>`}).join('')}
/* player */
function startSrc(k,i=0){if(st.src===k&&st.i===i&&!st.uqNow){st.on=!st.on;return render()}st.uqNow=null;st.src=k;st.i=i;st.t=0;st.on=true;onTrack(true)}
function toggleSrc(k){if(st.src===k){st.on=!st.on;render()}else startSrc(k,0)}
function onTrack(anim){if(SRC[st.src].journey&&!st.uqNow)st.jHeard.add(curK());const s=cur();document.documentElement.style.setProperty('--tone',TONE[s.art]);
 $('stArt').innerHTML=svg(s.art);$('lab').innerHTML=svg(s.art);$('barArt').innerHTML=svg(s.art);
 if(anim){$('stArt').classList.remove('swap');void $('stArt').offsetWidth;$('stArt').classList.add('swap')}lastLy=-1;render()}
function next(manual){if(st.uq.length){st.uqNow=st.uq.shift();st.t=0;onTrack(true);return}const was=st.uqNow;st.uqNow=null;const q=SRC[st.src].q;if(was&&false){}if(st.i<q.length-1){st.i++;st.t=0;onTrack(true)}else{st.on=false;st.t=manual?st.t:cur().d;ended=true;render()}}
let lastLy=-1,ended=false;
function render(){const s=cur(),src=SRC[st.src],q=src.q,k=curK();document.body.classList.toggle('paused',!st.on);document.body.classList.toggle('playing',st.on);
 $('stCap').innerHTML=`${st.on?'<span class="eq"><i></i><i></i><i></i></span>Now playing':'Paused'} · ${st.uqNow?'Your queue · then '+src.name:(src.journey?src.name:src.type+' · '+src.name)+` · <span class="m" style="letter-spacing:0">${pad(st.i+1)}/${pad(q.length)}</span>`}`;
 $('stTitle').textContent=s.t;$('stArtist').textContent=s.a;$('barTitle').textContent=s.t;$('barArtist').textContent=s.a;
 const pi=ICON(st.on?'pause':'play');$('bigpp').innerHTML=pi;$('pp').innerHTML=pi;$('bigpp').setAttribute('aria-label',st.on?'Pause':'Play');$('pp').setAttribute('aria-label',st.on?'Pause':'Play');
 const lk=$('like');lk.classList.toggle('on',st.liked.has(k));lk.setAttribute('aria-pressed',st.liked.has(k));
 $('goSrc').textContent=src.journey?'Open Journey':src.type==='Playlist'?'Go to playlist':src.type==='Mix'||src.type==='Mood'?'Open '+src.name:'Go to '+src.type.toLowerCase();
 const li=s.ly?Math.floor(st.t/7)%s.ly.length:-1;if(li!==lastLy){lastLy=li;$('stLyr').innerHTML=`<span>${s.ly?s.ly[li]:'Instrumental'}</span>`}
 const upn=[...st.uq.map(x=>[x,null]),...q.slice(st.i+1).map((x,j)=>[x,st.i+1+j])];const rest=upn.slice(0,2);$('stNext').innerHTML=`<div class="cap"><span>Up next</span><span>${upn.length} left</span></div>`+(rest.length?rest.map(([x,ix])=>`<button class="qi" ${ix===null?'data-k="'+x+'"':`data-src="${st.src}" data-i="${ix}"`}><span class="cover">${svg(S[x].art)}</span><div><b>${S[x].t}</b><span>${S[x].a}</span></div></button>`).join(''):`<div class="end">End of ${src.name}. Playback stops here.</div>`);
 tick();
 document.querySelectorAll('[data-src]').forEach(e=>{const same=e.dataset.src===st.src&&(e.dataset.i===undefined||e.classList.contains('qi')?e.dataset.src===st.src:+e.dataset.i===st.i||e.closest('#rels'));const on=e.dataset.src===st.src&&(e.closest('#repeat')?+e.dataset.i===st.i:true);e.classList.toggle('on',on&&!e.classList.contains('qi'));const pb=e.querySelector('.pb');if(pb)pb.innerHTML=ICON(on&&st.on?'pause':'play')});
 document.querySelectorAll('.md').forEach(m=>m.classList.toggle('on',m.dataset.src===st.src&&st.on));
 /* journey state */
 const inJ=!!src.journey,heard=st.jHeard.size;$('jrStat').textContent=`3 of 7 artists · Moni Gray ${heard}/6 songs`;
 $('jrAct').innerHTML=inJ?`<button class="btn gh" id="jOpen">Open Journey</button><button class="btn pri" id="jPP">${ICON(st.on?'pause':'play')}${st.on?'Pause':'Resume'}</button>`:`<button class="btn gh" id="jOpen">Open Journey</button><button class="btn pri" id="jPP">${ICON('play')}${heard?'Resume':'Start'} Moni Gray</button>`;
 $('jPP').onclick=e=>{e.stopPropagation();inJ?(st.on=!st.on,render()):startSrc('journey',heard&&heard<6?heard:0)};$('jOpen').onclick=()=>toast('Journey page is the next design step');
 const node=document.querySelector('.node.c');node.classList.toggle('live',inJ&&st.on);$('ringFg').style.strokeDashoffset=220-220*heard/6;$('curNodeM').textContent=inJ?`Playing · ${heard}/6`:heard?`${heard}/6 heard`:'Next · 6 songs';
 {const done=41,tot=88;$('jfoot').innerHTML=`<span><b>${done+heard}</b> of ${tot} songs</span><div class="jb"><i style="width:${done/tot*100}%"></i><i style="width:${heard/tot*100}%"></i></div><span>Then <b>Nia Vale</b> · 11 songs</span>`}
 buildGJ();
 /* drawer */
 $('dSrc').textContent=`Playing from ${src.type} · ${src.name}`;$('dList').innerHTML=(st.uq.length?`<div class="cap dq-h">Next in queue</div>`+st.uq.map((x,j)=>`<button class="dq" data-k="${x}"><span class="m">+</span><span class="cover">${svg(S[x].art)}</span><div><b>${S[x].t}</b><span>${S[x].a}</span></div><span class="m">${fmt(S[x].d)}</span></button>`).join('')+`<div class="cap dq-h">Next from ${src.name}</div>`:'')+q.map((x,j)=>`<button class="dq${j===st.i?' on':j<st.i?' done':''}" data-src="${st.src}" data-i="${j}"><span class="m">${j===st.i&&st.on?'<span class="eq"><i></i><i></i><i></i></span>':pad(j+1)}</span><span class="cover">${svg(S[x].art)}</span><div><b>${S[x].t}</b><span>${S[x].a}</span></div><span class="m">${fmt(S[x].d)}</span></button>`).join('')}
function tick(){const s=cur(),p=st.t/s.d;bars.forEach((b,i)=>b.classList.toggle('p',i/N<p));$('tNow').textContent=fmt(st.t);$('tEnd').textContent=fmt(s.d);$('stProg').style.width=(p*100)+'%';const li=s.ly?Math.floor(st.t/7)%s.ly.length:-1;if(li!==lastLy){lastLy=li;$('stLyr').innerHTML=`<span>${s.ly?s.ly[li]:'Instrumental'}</span>`}}
setInterval(()=>{if(!st.on)return;st.t+=.25;if(st.t>=cur().d)next();else tick()},250);
/* events */
document.addEventListener('click',e=>{const t=e.target.closest('[data-src]');if(!t||t.id==='jPP')return;if(t.classList.contains('li')||t.classList.contains('md')||t.closest('#rels')||t.classList.contains('node'))toggleSrc(t.dataset.src);else startSrc(t.dataset.src,+t.dataset.i||0)});
document.addEventListener('click',e=>{const u=e.target.closest('.qi[data-k],.dq[data-k]');if(u){const k=u.dataset.k;st.uq.splice(st.uq.indexOf(k),1);st.uqNow=k;st.t=0;st.on=true;onTrack(true)}});
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)toggleSrc(g.dataset.go)});
$('bigpp').onclick=$('pp').onclick=()=>{if(ended){ended=false;st.i=0;st.t=0;onTrack(true)}st.on=!st.on;render()};
$('next').onclick=()=>next(true);$('prev').onclick=()=>{if(st.t>3||st.i===0){st.t=0;tick()}else{st.i--;st.t=0;onTrack(true)}};
$('wv').onclick=e=>{const r=$('wv').getBoundingClientRect();st.t=(e.clientX-r.left)/r.width*cur().d;tick()};
$('like').onclick=()=>{const k=curK();st.liked.has(k)?st.liked.delete(k):st.liked.add(k);const l=$('like');l.classList.remove('pop');void l.offsetWidth;l.classList.add('pop');toast(st.liked.has(k)?'Added to Liked songs':'Removed from Liked songs');buildSide();render()};
$('fol').onclick=()=>{const f=$('fol');f.classList.toggle('on');f.textContent=f.classList.contains('on')?'Following':'Follow'};
$('qBtn').onclick=()=>{$('drawer').classList.toggle('open');$('qBtn').classList.toggle('on')};
/* add to playlist */
$('addBtn').onclick=e=>{e.stopPropagation();const r=$('addBtn').getBoundingClientRect(),p=$('pop');p.style.width='';p.style.left=r.left+'px';p.style.top=(r.bottom+8)+'px';p.innerHTML='<div class="cap">Add to playlist</div>'+['late','sunday','focus'].map(k=>`<button data-add="${k}"><span class="cover">${svg(SRC[k].art)}</span>${SRC[k].name}${st.pl[k].includes(curK())?'<span class="m" style="margin-left:auto;color:var(--t3)">added</span>':''}</button>`).join('')+`<button data-add="new">${ICON('plus')}New playlist</button>`;p.classList.add('open')};
document.addEventListener('click',e=>{const a=e.target.closest('[data-add]');const p=$('pop');if(a){const k=a.dataset.add,c=curK();if(k==='new')toast('New playlist created with '+cur().t);else if(st.pl[k].includes(c))toast('Already in '+SRC[k].name,'Add anyway',()=>{st.pl[k].push(c);buildSide();toast('Added again to '+SRC[k].name)});else{st.pl[k].push(c);buildSide();toast('Added to '+SRC[k].name,'Undo',()=>{st.pl[k].pop();buildSide();toast('Removed from '+SRC[k].name)})}p.classList.remove('open')}else if(!e.target.closest('#addBtn'))p.classList.remove('open')});
let tt;function toast(tx,btn,fn){$('toastTx').textContent=tx;const b=$('toastBtn');b.style.display=btn?'':'none';b.textContent=btn||'';b.onclick=()=>{fn&&fn()};$('toast').classList.add('open');clearTimeout(tt);tt=setTimeout(()=>$('toast').classList.remove('open'),3200)}
/* filter */
const seg=$('seg'),pill=seg.querySelector('.pill');function movePill(b){pill.style.left=b.offsetLeft+'px';pill.style.width=b.offsetWidth+'px'}
seg.querySelectorAll('button').forEach(b=>b.onclick=()=>{seg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));movePill(b);const f=b.dataset.f;document.querySelectorAll('section[data-f]').forEach(s=>{const show=s.dataset.f.split(' ').includes(f);s.classList.toggle('hidden',!show);if(show){s.classList.remove('rise');void s.offsetWidth;s.classList.add('rise')}})});
/* palette */
const IDX=[...Object.keys(S).map(k=>({g:'Songs',k,src:null,t:S[k].t,s:S[k].a,art:S[k].art})),...['late','sunday','focus','silver','north'].map(k=>({g:SRC[k].type==='Playlist'?'Playlists':'Releases',src:k,t:SRC[k].name,s:SRC[k].type+' · '+SRC[k].q.length+' songs',art:SRC[k].art})),...[['Kairo Vale','night'],['Moni Gray','small'],['Asha North','cont'],['Nia Vale','north']].map(([n,a])=>({g:'Artists',t:n,s:'Artist',art:a,artist:1}))];
let sel=0,res=[];function palRender(){const q=$('palIn').value.trim().toLowerCase();const ORD={Artists:0,Playlists:1,Releases:2,Songs:3};res=(q?IDX.filter(x=>(x.t+' '+x.s).toLowerCase().includes(q)).sort((a,b)=>ORD[a.g]-ORD[b.g]).filter((x,i,arr)=>x.g!=='Songs'||arr.slice(0,i).filter(y=>y.g==='Songs').length<4):IDX.filter(x=>['night','m1','s1'].includes(x.k)||x.src==='late'||x.t==='Moni Gray')).slice(0,8);sel=Math.min(sel,Math.max(0,res.length-1));let g='',h='';res.forEach((x,i)=>{if(x.g!==g){g=x.g;h+=`<div class="cap grp">${q?g:i===0?'Recent':''}</div>`.replace('<div class="cap grp"></div>','')}h+=`<button class="pr${i===sel?' sel':''}" data-pi="${i}"><span class="cover${x.artist?' r':''}">${svg(x.art)}</span><div><b>${x.t}</b><span>${x.s}</span></div><span class="k m">↵ ${x.artist?'open':'play'}</span></button>`});$('palRes').innerHTML=h||`<div style="padding:28px;text-align:center;color:var(--t3)">No results for “${$('palIn').value}”</div>`}
function palOpen(){$('pal').classList.add('open');$('scrim').classList.add('open');$('palIn').value='';sel=0;palRender();setTimeout(()=>$('palIn').focus(),20)}
function palClose(){$('pal').classList.remove('open');$('scrim').classList.remove('open');$('openPal').focus()}
function palGo(i){const x=res[i];if(!x)return;palClose();if(x.artist)return toast('Artist pages come in a later design step');if(x.src)return startSrc(x.src,0);const q=Object.keys(SRC).find(k=>SRC[k].q.length>1&&SRC[k].q.includes(x.k)&&!SRC[k].journey&&SRC[k].type!=='Mood'&&SRC[k].type!=='Mix'&&SRC[k].type!=='Playlist')||Object.keys(SRC).find(k=>SRC[k].q.includes(x.k));startSrc(q,SRC[q].q.indexOf(x.k))}
$('openPal').onclick=palOpen;$('scrim').onclick=palClose;$('palIn').oninput=()=>{sel=0;palRender()};
$('palRes').onclick=e=>{const b=e.target.closest('[data-pi]');if(b)palGo(+b.dataset.pi)};
document.addEventListener('keydown',e=>{const open=$('pal').classList.contains('open');if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open?palClose():palOpen();return}
 if(open){if(e.key==='Escape')palClose();if(e.key==='ArrowDown'){sel=Math.min(res.length-1,sel+1);palRender();e.preventDefault()}if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);palRender();e.preventDefault()}if(e.key==='Enter')palGo(sel);return}
 if(e.code==='Space'&&!/INPUT|BUTTON/.test(e.target.tagName)){e.preventDefault();st.on=!st.on;render()}
 if(e.key==='Escape'){$('drawer').classList.remove('open');$('pop').classList.remove('open')}});
/* theme */
function setTheme(t){document.documentElement.dataset.theme=t;$('thm').innerHTML=`<svg class="ic" viewBox="0 0 24 24">${t==='light'?MOON:SUN}</svg>`;$('thm').setAttribute('aria-label',t==='light'?'Switch to dark mode':'Switch to light mode');try{localStorage.setItem('rondo-theme',t)}catch(e){}}
$('thm').onclick=()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light');
/* journeys view */
const GJ=[['Hip-Hop','#3a1515',['cont','margins','night','small','north'],3,7,'journey'],['R&B','#1a2c4b',['silver','blue','soft','north'],1,6,null],['Electronic','#232a1b',['open','margins','north'],0,5,null],['Jazz','#3a2a12',['first','blue','silver'],0,4,null]];
function buildGJ(){const inJ=!!SRC[st.src].journey;$('gjs').innerHTML=GJ.map(([g,c,a,d,n,src])=>{const live=src&&inJ&&st.on;const main=src?(inJ?(st.on?'Pause':'Resume'):'Resume Moni Gray'):d?'Resume':'Start';return `<div class="gj${live?' live':''}" style="background:${c}"><span class="cap">${d?d+' of '+n+' artists':n+' artists'}</span><h3>${g}</h3><div class="stack">${a.map(x=>`<span class="cover">${svg(x)}</span>`).join('')}</div><div class="pg"><div class="bar3"><i style="width:${d/n*100}%"></i></div><div class="acts"><button class="btn pri" ${src?'data-jpp="1"':'data-soon="'+g+'"'}>${ICON(live?'pause':'play')}${main}</button><button class="btn gh" data-soon="${g} Journey">Open</button></div></div></div>`}).join('')}
function buildFin(){$('fin').innerHTML=[['Kairo Vale','night','20 songs · Hip-Hop','Oct 3'],['Dax Moreno','margins','9 songs · Hip-Hop','Sep 28'],['Asha North','cont','12 songs · Hip-Hop','Sep 21']].map(([n,a,s,d])=>`<div class="fr"><span class="cover">${svg(a)}</span><div><b>${n}</b><br><span>${s}</span></div><span class="m">Finished ${d}</span><button class="btn gh" data-soon="${n}">Replay</button></div>`).join('')}
function buildFol(){$('folrow').innerHTML=[['Asha North','cont','New EP',1],['Mira Son','soft','New single',1],['Kairo Vale','night','20 songs'],['Nia Vale','north','13 songs'],['Moni Gray','small','6 songs'],['Theo June','first','14 songs']].map(([n,a,s,nw])=>`<button class="fa" data-soon="${n}"><span class="cw"><span class="cover">${svg(a)}</span>${nw?'<span class="nb">NEW</span>':''}</span><b>${n}</b><span>${s}</span></button>`).join('')}
document.addEventListener('click',e=>{const j=e.target.closest('[data-jpp]');if(j){e.stopPropagation();SRC[st.src].journey?(st.on=!st.on,render()):startSrc('journey',st.jHeard.size&&st.jHeard.size<6?st.jHeard.size:0);return}const so=e.target.closest('[data-soon]');if(so)toast(so.dataset.soon+' opens in a later design step')});
/* song menu */
function songOf(el){if(el.dataset.k)return el.dataset.k;const s=SRC[el.dataset.src];return s?s.q[+el.dataset.i||0]:null}
function menu(k,x,y){const p=$('pop'),s=S[k];p.style.width='';p.style.left=Math.min(x,innerWidth-260)+'px';p.style.top=Math.min(y,innerHeight-330)+'px';p.innerHTML=`<div class="cap">${s.t}</div><button data-mn="next" data-mk="${k}">${ICON('next')}Play next</button><button data-mn="queue" data-mk="${k}">${ICON('queue')}Add to queue</button><button data-mn="pl" data-mk="${k}">${ICON('plus')}Add to playlist</button><div class="sep"></div><button data-mn="artist" data-mk="${k}">${ICON('journey')}Go to artist<span class="k">${s.ar}</span></button><button data-mn="share" data-mk="${k}">${ICON('share')}Share</button>`;p.classList.add('open')}
document.addEventListener('contextmenu',e=>{const el=e.target.closest('.it,.qi,.dq,.pr');if(!el)return;const k=songOf(el)||(el.dataset.pi!==undefined&&res[+el.dataset.pi]&&res[+el.dataset.pi].k);if(!k)return;e.preventDefault();menu(k,e.clientX,e.clientY)});
$('moreBtn').onclick=e=>{e.stopPropagation();const r=$('moreBtn').getBoundingClientRect();menu(curK(),r.left,r.bottom+8)};
document.addEventListener('click',e=>{const m=e.target.closest('[data-mn]');if(!m)return;e.stopPropagation();const k=m.dataset.mk,a=m.dataset.mn;$('pop').classList.remove('open');
 if(a==='next'){st.uq.unshift(k);render();toast(S[k].t+' plays next','Undo',()=>{st.uq.splice(st.uq.indexOf(k),1);render()})}
 if(a==='queue'){st.uq.push(k);render();toast('Added to queue','Undo',()=>{st.uq.splice(st.uq.lastIndexOf(k),1);render()})}
 if(a==='pl')setTimeout(()=>$('addBtn').click(),10);
 if(a==='artist')toast('Artist page is the next design step');if(a==='share')toast('Link copied')},true);
/* ===== rev 3: final Home features ===== */
const X={shuf:true,rep:0,vol:.7,muted:false,sleep:0,sleepEnd:false,xf:0,read:false,repAll:false,moreG:false,edit:false,custom:[],npK:null,mode:'auto'};
const ME={name:'mikoto',init:'M'};
/* repeat + sleep aware next (still source-bounded: repeat loops the same source, never expands it) */
next=function(manual){if(!manual&&X.rep===2){st.t=0;tick();return}
 if(!manual&&X.sleepEnd){X.sleepEnd=false;st.on=false;st.t=0;render();sleepUI();return toast('Sleep timer: stopped after the song')}
 if(st.uq.length){st.uqNow=st.uq.shift();st.t=0;onTrack(true);return}
 st.uqNow=null;const q=SRC[st.src].q;if(st.i<q.length-1){st.i++;st.t=0;onTrack(true)}else if(X.rep===1){st.i=0;st.t=0;onTrack(true)}else{st.on=false;st.t=manual?st.t:cur().d;ended=true;render()}};
const _render=render;render=function(){_render();npSync()};const _tick=tick;tick=function(){_tick();npLine()};
/* ---- overlays ---- */
function anyOpen(){return $('modal').classList.contains('open')}
function openModal(html,cls){const m=$('modal');m.className='modal open '+(cls||'');m.innerHTML=html;$('scrim').classList.add('open');$('pop').classList.remove('open');ntfClose();setTimeout(()=>{const f=m.querySelector('[data-close]');f&&f.focus()},30)}
function closeModal(){if(!anyOpen())return false;$('modal').classList.remove('open');clearInterval(rcT);if(!$('pal').classList.contains('open'))$('scrim').classList.remove('open');return true}
$('scrim').onclick=()=>{if($('pal').classList.contains('open'))palClose();closeModal()};
document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeModal()});
const XB=`<button class="icb xb" data-close aria-label="Close">${ICON('x')}</button>`;
function popAt(btn,html,w,up){const r=btn.getBoundingClientRect(),p=$('pop');p.style.width=(w||240)+'px';p.innerHTML=html;p.classList.add('open');const h=p.offsetHeight;let x=Math.min(r.left,innerWidth-(w||240)-12);if(r.right>innerWidth-160)x=r.right-(w||240);p.style.left=x+'px';p.style.top=(up?r.top-h-10:r.bottom+8)+'px'}
/* ---- Now Playing + full lyrics ---- */
function lines(s){return s.ly}
function npOpen(){$('np').classList.add('open');$('lyrBtn').classList.add('on');X.npK=null;npSync()}
function npClose(){$('np').classList.remove('open');$('lyrBtn').classList.remove('on')}
function npSync(){if(!$('np').classList.contains('open'))return;const k=curK(),s=S[k],src=SRC[st.src];
 if(X.npK!==k){X.npK=k;const L=lines(s);$('np').innerHTML=`<div class="nph"><span class="cap">${st.uqNow?'Your queue':src.type+' · '+src.name}</span><button class="icb" id="npX" aria-label="Close (L)">${ICON('down')}</button></div>
 <div class="npl"><span class="cover">${svg(s.art)}</span><h2>${s.t}</h2><p>${s.a}</p><div class="tags m"><span>${s.bpm} BPM</span><span>${s.key}</span><span>${fmt(s.d)}</span></div>
 <div class="npa"><button class="icb like${st.liked.has(k)?' on':''}" id="npLike" aria-label="Like"><svg class="ic f" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/></svg></button><button class="btn gh" data-share="${k}">${ICON('share')}Share lyric</button></div></div>
 <div class="npr" id="npr">${L?L.map((l,i)=>`<button class="ln" data-ln="${i}">${l}</button>`).join('')+`<div class="cred m">Lyrics · ${s.ar}</div>`:`<div class="inst"><b>Instrumental</b><span>No lyrics in this one. ${s.bpm} BPM, ${s.key}.</span></div>`}</div>`;
  $('npX').onclick=npClose;$('npLike').onclick=()=>{$('like').click();X.npK=null;npSync()};lastNp=-1}
 npLine()}
let lastNp=-1;function npLine(){if(!$('np').classList.contains('open'))return;const L=cur().ly;const li=L?Math.floor(st.t/7)%L.length:-1;if(li===lastNp)return;lastNp=li;const r=$('npr');if(!r)return;r.querySelectorAll('.ln').forEach((b,i)=>{b.classList.toggle('past',i<li);b.classList.toggle('now',i===li)});const n=r.querySelector('.ln.now');if(n)r.scrollTo({top:n.offsetTop-r.clientHeight/2+n.offsetHeight/2,behavior:'smooth'})}
document.addEventListener('click',e=>{const l=e.target.closest('[data-ln]');if(l){st.t=+l.dataset.ln*7;lastNp=-1;tick()}});
$('lyrBtn').onclick=()=>$('np').classList.contains('open')?npClose():npOpen();
$('stTitle').onclick=$('stArt').onclick=npOpen;$('stTitle').title='Open Now Playing (L)';
/* ---- Share card ---- */
let sh={k:null,f:'story',ln:0,bg:'sleeve'};
function shareOpen(k){sh={k,f:'story',ln:0,bg:'sleeve'};openModal('<div id="shBody"></div>','share');shareR()}
function shareR(){const s=S[sh.k],L=s.ly||[];const bg=sh.bg==='sleeve'?TONE[s.art]:sh.bg==='light'?'#f1efe9':'#0d0d0c',fg=sh.bg==='light'?'#151513':'#efeee9';const line=L[sh.ln];
 $('shBody').innerHTML=`<div class="shp"><div class="card ${sh.f}" style="background:${bg};color:${fg}"><span class="cover">${svg(s.art)}</span>${line&&sh.ln>=0?`<q>${line}</q>`:''}<div class="ct"><b>${s.t}</b><span>${s.a}</span></div><div class="cf"><svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="38 9" transform="rotate(-60 10 10)"/></svg>rondo</div></div></div>
 <div class="sho"><div class="hdr"><h3>Share</h3>${XB}</div><span class="cap">Format</span><div class="sg">${[['story','Story 9:16'],['square','Post 1:1']].map(([v,t])=>`<button data-shf="${v}" class="${sh.f===v?'on':''}">${t}</button>`).join('')}</div>
 <span class="cap">Background</span><div class="sw">${[['sleeve',TONE[s.art]],['dark','#0d0d0c'],['light','#f1efe9']].map(([v,c])=>`<button data-shb="${v}" class="${sh.bg===v?'on':''}" style="background:${c}" aria-label="${v} background"></button>`).join('')}</div>
 <span class="cap">Lyric</span><div class="lns">${L.length?[...L.map((l,i)=>`<button data-shl="${i}" class="${sh.ln===i?'on':''}">${l}</button>`),`<button data-shl="-1" class="${sh.ln===-1?'on':''}">No lyric</button>`].join(''):'<span class="mut">Instrumental, no lyric to add</span>'}</div>
 <div class="sha"><button class="btn pri" data-sht="Image saved to Downloads">${ICON('dl')}Save image</button><button class="btn gh" data-sht="Link copied">${ICON('link')}Copy link</button></div></div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-shf],[data-shb],[data-shl],[data-sht],[data-share]');if(!t)return;if(t.dataset.share){e.stopPropagation();$('pop').classList.remove('open');return shareOpen(t.dataset.share)}if(t.dataset.shf)sh.f=t.dataset.shf;if(t.dataset.shb)sh.bg=t.dataset.shb;if(t.dataset.shl)sh.ln=+t.dataset.shl;if(t.dataset.sht){closeModal();return toast(t.dataset.sht)}shareR()});
/* ---- Monthly recap (story slides) ---- */
const RC=[
 {c:'#17223a',h:`<span class="cap">September on Rondo</span><div class="cal">${Array.from({length:30},(_,i)=>{const v=[2,1,0,3,2,4,3,1,2,2,0,3,4,4,1,2,3,2,1,4,5,3,2,1,2,3,4,2,3,1][i];return `<i class="v${v}"${i===19?' title="Sat 20"':''}></i>`}).join('')}</div><div class="huge">21<small>h</small> 40<small>m</small></div><p>412 songs. Your busiest day was Saturday the 20th.</p>`},
 {c:'#3a1515',h:`<span class="cap">Top artists</span><ol class="ta">${[['Kairo Vale','night',112],['Moni Gray','small',86],['Asha North','cont',61],['Nia Vale','north',44],['Sora K','margins',30]].map(([n,a,p],i)=>`<li><span class="m">${i+1}</span><span class="cover">${svg(a)}</span><b>${n}</b><span class="m">${p}</span></li>`).join('')}</ol><p class="m sm">plays</p>`},
 {c:'#1a2c4b',h:`<span class="cap">Song of the month</span><span class="cover big">${svg('night')}</span><h2>Night Transit</h2><p>Kairo Vale, Mira Son · 38 plays</p>`},
 {c:'#232a1b',h:`<span class="cap">Found</span><div class="huge">9</div><p>new artists, 3 of them through your Hip-Hop Journey. You finished Kairo Vale, Dax Moreno and Asha North.</p>`},
 {c:'#45200f',h:`<span class="cap">Your sound</span><div class="snd"><div><b>92</b><span>avg BPM</span></div><div><b>Late night</b><span>top mood</span></div><div><b>Hip-Hop</b><span>top genre</span></div></div><button class="btn pri" data-sht="Recap card saved">${ICON('dl')}Save my month</button>`}];
let rcI=0,rcT;function recapOpen(){rcI=0;openModal(`<div class="rcw"><div class="segs">${RC.map(()=>'<i><b></b></i>').join('')}</div><div id="rcS"></div>${XB}</div><button class="rnav l" id="rcP" aria-label="Previous card">${ICON('left')}</button><button class="rnav r" id="rcN" aria-label="Next card">${ICON('right')}</button>`,'recap');rcR();$('rcP').onclick=()=>rcGo(-1);$('rcN').onclick=()=>rcGo(1)}
function rcR(){const r=RC[rcI];const w=$('modal').querySelector('.rcw');w.style.background=r.c;$('rcS').innerHTML=`<div class="sl2">${r.h}</div>`;w.querySelectorAll('.segs i').forEach((s,i)=>{s.className=i<rcI?'d':i===rcI?'a':''});clearInterval(rcT);if(rcI<RC.length-1&&!(window.DEMO||{}).recap)rcT=setInterval(()=>rcGo(1),5200)}
function rcGo(d){rcI=Math.max(0,Math.min(RC.length-1,rcI+d));rcR()}
$('recapBtn').onclick=recapOpen;
/* ---- Notifications ---- */
const NT=[[1,'silver','<b>Asha North</b> released the EP <b>Silver Weather</b>','2d','silver'],[1,'soft','<b>Mira Son</b> dropped a new single, <b>Soft Collision</b>','5d','soft'],[1,'night','Your <b>September recap</b> is ready','1d','recap'],[0,'night','You finished <b>Kairo Vale</b> in your Hip-Hop Journey. Up next: Moni Gray','Oct 3','journey'],[0,'north','<b>Nia Vale</b> added a song to <b>North Window</b>','Sep 18','north']];
function ntfR(){$('ntf').innerHTML=`<div class="hdr"><h3>Notifications</h3><button class="lnk" id="ntfRead">${X.read?'All caught up':'Mark all as read'}</button></div>`+NT.map(([n,a,tx,tm,act],i)=>`${i===0?'<div class="cap g">New</div>':i===3?'<div class="cap g">Earlier</div>':''}<div class="nt${n&&!X.read?' un':''}"><span class="cover${act==='journey'?' r':''}">${svg(a)}</span><div><p>${tx}</p><span class="m">${tm}</span></div>${act==='recap'?'<button class="btn gh sm" data-rcp>View</button>':act==='journey'?'<button class="btn gh sm" data-jpp="1">Start</button>':`<button class="ntp" data-src="${act}" aria-label="Play"><span class="pb"></span></button>`}</div>`).join('');$('ntfRead').onclick=()=>{X.read=true;$('bell').classList.remove('dotn');$('bell').setAttribute('aria-label','Notifications');ntfR()};render()}
function ntfClose(){$('ntf').classList.remove('open');$('bell').classList.remove('on')}
$('bell').onclick=e=>{e.stopPropagation();if($('ntf').classList.contains('open'))return ntfClose();ntfR();$('ntf').classList.add('open');$('bell').classList.add('on')};
document.addEventListener('click',e=>{if(e.target.closest('[data-rcp]')){ntfClose();recapOpen()}else if(!e.composedPath().some(n=>n.id==='ntf'||n.id==='bell'))ntfClose()});
/* ---- Profile, appearance, shortcuts ---- */
function setMode(m){X.mode=m;const t=m==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m;setTheme(t);try{localStorage.setItem('rondo-theme',m)}catch(e){}}
$('thm').onclick=()=>setMode(document.documentElement.dataset.theme==='light'?'dark':'light');
$('prof').onclick=e=>{e.stopPropagation();popAt($('prof'),`<div class="who"><span class="av">${ME.init}</span><div><b>${ME.name}</b><span>Listening since Aug 2026</span></div></div><div class="sep"></div><button data-soon="Profile">${ICON('user')}Profile</button><div class="apr"><span>Appearance</span><div class="sg">${['dark','light','auto'].map(m=>`<button data-mode="${m}" class="${X.mode===m?'on':''}">${m[0].toUpperCase()+m.slice(1)}</button>`).join('')}</div></div><button data-keys>${ICON('kb')}Keyboard shortcuts<span class="k">?</span></button><button data-soon="Settings">${ICON('gear')}Settings</button><div class="sep"></div><button data-soon="Log out">${ICON('out')}Log out</button>`,270)};
document.addEventListener('click',e=>{const m=e.target.closest('[data-mode]');if(m){e.stopPropagation();setMode(m.dataset.mode);m.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===m))}if(e.target.closest('[data-keys]')){$('pop').classList.remove('open');keysOpen()}},true);
const KEYS=[['Playback',[['Space','Play / pause'],['⇧ →','Next song'],['⇧ ←','Previous song'],['→  ←','Skip 5 seconds'],['S','Shuffle'],['R','Repeat: off, source, song'],['M','Mute']]],['Go to',[['⌘ K','Search'],['L','Now playing + lyrics'],['Q','Queue'],['N','Notifications'],['T','Light / dark'],['?','This list'],['Esc','Close']]]];
function keysOpen(){openModal(`<div class="hdr"><h3>Keyboard shortcuts</h3>${XB}</div><div class="kg">${KEYS.map(([g,l])=>`<div><span class="cap">${g}</span>${l.map(([k,d])=>`<div class="kr"><span>${d}</span><span class="kk">${k.split(' ').filter(Boolean).map(x=>`<kbd>${x}</kbd>`).join('')}</span></div>`).join('')}</div>`).join('')}</div>`,'keys')}
/* ---- New playlist / Blend ---- */
const _bs=buildSide;buildSide=function(){_bs();$('pls').insertAdjacentHTML('beforeend',X.custom.map(n=>`<button class="li" data-soon="${n}"><span class="cover empty">${ICON('list')}</span><div><b>${n}</b><span>0 songs</span></div></button>`).join(''))};
$('newPl').onclick=e=>{e.stopPropagation();popAt($('newPl'),`<button data-np="pl">${ICON('list')}<div class="two"><b>New playlist</b><span>Start empty, add songs as you go</span></div></button><button data-np="blend">${ICON('blend')}<div class="two"><b>New Blend</b><span>One playlist from you + a friend</span></div></button>`,280)};
document.addEventListener('click',e=>{const n=e.target.closest('[data-np]');if(!n)return;$('pop').classList.remove('open');if(n.dataset.np==='pl'){const nm='New playlist '+(X.custom.length+1);X.custom.push(nm);buildSide();render();toast(nm+' created','Undo',()=>{X.custom.pop();buildSide();render()})}else blendOpen()});
function blendOpen(){openModal(`<div class="hdr"><h3>Start a Blend</h3>${XB}</div><div class="bl"><span class="av a">${ME.init}</span><span class="av b">?</span></div><p class="lead">Invite a friend. Rondo mixes the songs you both play into one playlist, and it refreshes every day as your taste changes.</p><div class="inv"><span class="m">Invite link · works for 7 days</span><button class="btn pri" data-sht="Invite link copied">${ICON('link')}Copy invite</button></div><p class="note">Your friend needs a Rondo account to join. You can leave a Blend any time.</p>`,'blend')}
/* ---- player bar ---- */
$('shuf').onclick=()=>{X.shuf=!X.shuf;$('shuf').classList.toggle('on',X.shuf);$('shuf').setAttribute('aria-pressed',X.shuf);$('shuf').setAttribute('aria-label','Shuffle '+(X.shuf?'on':'off'));toast('Shuffle '+(X.shuf?'on':'off'))};
function repUI(){const b=$('rep');b.classList.toggle('on',X.rep>0);b.classList.toggle('r1',X.rep===2);b.setAttribute('aria-label',['Repeat off','Repeat '+SRC[st.src].name,'Repeat this song'][X.rep])}
$('rep').onclick=()=>{X.rep=(X.rep+1)%3;repUI();toast(['Repeat off','Repeating '+SRC[st.src].name,'Repeating this song'][X.rep])};
function volUI(){const v=X.muted?0:X.vol;$('vol').querySelector('i').style.right=(100-v*100)+'%';$('vol').setAttribute('aria-valuenow',Math.round(v*100));$('volBtn').innerHTML=ICON(v===0?'mute':'vol');$('volBtn').setAttribute('aria-label',v===0?'Unmute (M)':'Mute (M)')}
function volAt(x){const r=$('vol').getBoundingClientRect();X.vol=Math.max(0,Math.min(1,(x-r.left)/r.width));X.muted=false;volUI()}
$('vol').onpointerdown=e=>{volAt(e.clientX);const mv=ev=>volAt(ev.clientX),up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
$('vol').onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowUp'){X.vol=Math.min(1,X.vol+.05);X.muted=false;volUI();e.preventDefault();e.stopPropagation()}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){X.vol=Math.max(0,X.vol-.05);volUI();e.preventDefault();e.stopPropagation()}};
$('volBtn').onclick=()=>{X.muted=!X.muted;volUI()};
$('devBtn').onclick=e=>{e.stopPropagation();popAt($('devBtn'),`<div class="cap">Playing on</div><button class="dv on">${ICON('dev')}<div class="two"><b>This browser</b><span>Chrome · Rondo web</span></div><span class="eq"><i></i><i></i><i></i></span></button><div class="sep"></div><p class="hint">Open Rondo on your phone or another computer with the same account and it shows up here.</p>`,280,true)};
let sleepT;function sleepUI(){const c=$('tmChip');c.classList.toggle('show',!!X.sleep||X.sleepEnd);c.textContent=X.sleepEnd?'end of song':X.sleep?fmt(X.sleep):'';$('tmBtn').classList.toggle('on',!!X.sleep||X.sleepEnd)}
function setSleep(m){clearInterval(sleepT);X.sleepEnd=m==='end';X.sleep=m==='end'||!m?0:m*60;sleepUI();if(X.sleep)sleepT=setInterval(()=>{X.sleep--;if(X.sleep<=0){clearInterval(sleepT);X.sleep=0;st.on=false;render();toast('Sleep timer ended. Paused.')}sleepUI()},1000);toast(m==='end'?'Stops after this song':m?'Sleep timer: '+(m<60?m+' min':'1 hour'):'Sleep timer off')}
function tmPop(){popAt($('tmBtn'),`<div class="cap">Sleep timer</div>${[[0,'Off'],[15,'15 min'],[30,'30 min'],[45,'45 min'],[60,'1 hour'],['end','End of this song']].map(([v,t])=>{const on=v==='end'?X.sleepEnd:v===0?!X.sleep&&!X.sleepEnd:X.sleep&&Math.ceil(X.sleep/60/15)*15===v;return `<button data-sleep="${v}" class="${on?'on':''}">${t}${on?`<span class="k">${ICON('check')}</span>`:''}</button>`}).join('')}<div class="sep"></div><div class="cap">Crossfade</div><div class="sg xf">${[0,3,6,12].map(v=>`<button data-xf="${v}" class="${X.xf===v?'on':''}">${v?v+'s':'Off'}</button>`).join('')}</div><p class="hint">Albums and EPs always play gapless.</p>`,250,true)}
$('tmBtn').onclick=e=>{e.stopPropagation();tmPop()};$('tmChip').onclick=e=>{e.stopPropagation();tmPop()};
document.addEventListener('click',e=>{const s=e.target.closest('[data-sleep]');if(s){e.stopPropagation();$('pop').classList.remove('open');setSleep(s.dataset.sleep==='end'?'end':+s.dataset.sleep)}const x=e.target.closest('[data-xf]');if(x){e.stopPropagation();X.xf=+x.dataset.xf;x.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===x));toast(X.xf?'Crossfade '+X.xf+' seconds':'Crossfade off')}},true);
/* ---- See all / Browse / Manage ---- */
SRC.repeat.q.push('m1','soft','north','s4','margins','s5');Object.assign(REPEAT_COUNT,{m1:3,soft:3,north:3,s4:2,margins:2,s5:2});
const _br=buildRepeat;buildRepeat=function(){_br();[...$('repeat').children].forEach((c,i)=>{if(i>=6&&!X.repAll)c.remove()})};
$('repAll').onclick=()=>{X.repAll=!X.repAll;$('repeat').classList.toggle('all',X.repAll);$('repAll').textContent=X.repAll?'Show less':'See all';buildRepeat();render()};
$('relAll').onclick=()=>document.querySelector('.seg [data-f=following]').click();
const GX=[['Pop','#4a1f3a',['soft','silver','first'],0,8,null],['Lo-fi','#2b2a3d',['north','blue','open'],0,6,null],['Rock','#2e1d16',['margins','cont'],0,7,null],['Afrobeats','#1f3a2e',['open','first','soft'],0,5,null]];
$('browseG').onclick=()=>{X.moreG=!X.moreG;if(X.moreG)GJ.push(...GX);else GJ.splice(4);$('browseG').textContent=X.moreG?'Show fewer':'Browse genres';render()};
$('manageF').onclick=()=>{X.edit=!X.edit;$('folrow').classList.toggle('edit',X.edit);$('manageF').textContent=X.edit?'Done':'Manage'};
document.addEventListener('click',e=>{if(!X.edit)return;const f=e.target.closest('.fa');if(!f)return;e.stopPropagation();const nx=f.nextSibling,par=f.parentNode,n=f.querySelector('b').textContent;f.remove();toast('Unfollowed '+n,'Undo',()=>{par.insertBefore(f,nx);toast('Following '+n)})},true);
/* ---- keyboard ---- */
document.addEventListener('keydown',e=>{if($('pal').classList.contains('open'))return;if(e.key==='Escape'){if(closeModal())return;if($('np').classList.contains('open'))return npClose();ntfClose();return}
 if($('pal').classList.contains('open')||anyOpen()||/INPUT|TEXTAREA/.test(e.target.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;const k=e.key;
 if(k==='?'){e.preventDefault();return keysOpen()}if(k==='/'){e.preventDefault();return palOpen()}
 if(e.shiftKey&&k==='ArrowRight'){e.preventDefault();return next(true)}if(e.shiftKey&&k==='ArrowLeft'){e.preventDefault();return $('prev').click()}
 if(k==='ArrowRight'||k==='ArrowLeft'){if(e.target.id==='vol')return;e.preventDefault();st.t=Math.max(0,Math.min(cur().d-1,st.t+(k==='ArrowRight'?5:-5)));lastNp=-1;return tick()}
 const m={l:()=>$('lyrBtn').click(),q:()=>$('qBtn').click(),s:()=>$('shuf').click(),r:()=>$('rep').click(),m:()=>$('volBtn').click(),t:()=>$('thm').click(),n:()=>$('bell').click()}[k.toLowerCase()];if(m&&!e.shiftKey){e.preventDefault();m()}});
/* share from song menu */
document.addEventListener('click',e=>{const m=e.target.closest('[data-mn="share"]');if(m){e.stopPropagation();e.preventDefault();$('pop').classList.remove('open');shareOpen(m.dataset.mk)}},true);
/* boot */
let saved=null;try{saved=localStorage.getItem('rondo-theme')}catch(e){}setMode((window.DEMO&&window.DEMO.theme)||saved||'auto');buildFin();buildFol();buildSide();buildPath();buildChart();buildRepeat();buildMoods();buildRels();movePill(seg.querySelector('.on'));
const D=window.DEMO||{};if(D.src){st.src=D.src;st.i=D.i||0}st.t=D.t??64;st.on=D.on??true;if(D.heard)D.heard.forEach(x=>st.jHeard.add(x));onTrack(false);
if(D.uq){st.uq=D.uq.slice();render()}if(D.filter)document.querySelector(`.seg [data-f=${D.filter}]`).click();if(D.menu)setTimeout(()=>$('moreBtn').click(),100);if(D.drawer){$('drawer').classList.add('open');$('qBtn').classList.add('on')}if(D.pal){palOpen();$('palIn').value=D.pal;palRender()}if(D.toast)toast(D.toast,'Undo');
if(D.scroll)setTimeout(()=>{$('main').style.scrollBehavior='auto';$('main').scrollTop=D.scroll},50);
volUI();repUI();sleepUI();
if(D.np)npOpen();if(D.share)shareOpen(D.share);if(D.recap){recapOpen();rcI=D.recap-1;rcR()}if(D.ntf)$('bell').click();if(D.keys)keysOpen();if(D.prof)setTimeout(()=>$('prof').click(),60);if(D.blend)blendOpen();if(D.tm){if(D.sleep)X.sleep=D.sleep;sleepUI();setTimeout(()=>tmPop(),60)}if(D.repAll)$('repAll').click();if(D.moreG)$('browseG').click();if(D.edit)$('manageF').click();if(D.newPl)setTimeout(()=>$('newPl').click(),60);
/* ===== rev 4 (2026-10-07, D-060..D-063): clean scrubber, Dig, phone layout ===== */
/* -- scrubber: thin line + thumb, grows on hover/drag, time bubble while dragging -- */
$('wv').className='sk';$('wv').innerHTML='<span class="sk-t"><i class="sk-f"></i><i class="sk-h"></i></span><span class="sk-b m"></span>';
$('wv').tabIndex=0;$('wv').setAttribute('aria-valuemin',0);
function skSync(){const s=cur(),p=Math.min(1,st.t/s.d);$('wv').style.setProperty('--p',p);$('wv').setAttribute('aria-valuemax',Math.round(s.d));$('wv').setAttribute('aria-valuenow',Math.round(st.t));$('wv').setAttribute('aria-valuetext',fmt(st.t)+' of '+fmt(s.d));document.documentElement.style.setProperty('--prog',p)}
{const _t4=tick;tick=function(){_t4();skSync()}}
function skAt(x,commit){const r=$('wv').getBoundingClientRect(),p=Math.max(0,Math.min(1,(x-r.left)/r.width));$('wv').style.setProperty('--h',p);$('wv').querySelector('.sk-b').textContent=fmt(p*cur().d);if(commit){st.t=p*cur().d;tick()}return p}
$('wv').onclick=null;
$('wv').onpointermove=e=>{if(!$('wv').classList.contains('drag'))skAt(e.clientX,false)};
$('wv').onpointerdown=e=>{e.preventDefault();$('wv').classList.add('drag');skAt(e.clientX,true);const mv=ev=>skAt(ev.clientX,true),up=()=>{$('wv').classList.remove('drag');removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
$('wv').onkeydown=e=>{const d=cur().d;if(e.key==='ArrowRight'){st.t=Math.min(d-1,st.t+5);tick();e.preventDefault();e.stopPropagation()}if(e.key==='ArrowLeft'){st.t=Math.max(0,st.t-5);tick();e.preventDefault();e.stopPropagation()}};

/* -- Dig: a finite daily stack of songs you have never played. 15 s hook, Keep or Skip. -- */
Object.assign(C,{d1:['#2b2f5e','#f0c94a','sun'],d2:['#0f3b36','#e8e2d4','stripes'],d3:['#e9e4d8','#2b2f5e','bars'],d4:['#6b2a4a','#f1e6d2','arc'],d5:['#1a1a1a','#d9d2b6','grid'],d6:['#c9a227','#141414','square'],d7:['#33405a','#ff8a5b','dots'],d8:['#efeae0','#7a1f3a','half'],d9:['#3c2a20','#e6dcc4','line'],d10:['#204a3a','#efeee9','circle-off']});
Object.assign(TONE,{d1:'#232650',d2:'#0e2f2b',d3:'#2a2d48',d4:'#4a1f35',d5:'#1c1c1a',d6:'#3d3210',d7:'#29344a',d8:'#4a1828',d9:'#33241b',d10:'#183a2e'});
const DIG=[['Paper Planes, Low','Juno Reyes','Indie pop',112,'B maj',196,'Folded every word you said'],['Static Bloom','Okay Kyoto','Alt R&B',94,'D min',214,'Static on the line, still you'],['Fourth Floor','Lio Marsh','Hip-Hop',90,'G min',187,'Fourth floor, window cracked'],['Velvet Arcade','Saya Bloom','Electronic',122,'F maj',232,null],['Gravel','Theo Kane','Alt rock',138,'E min',201,'Gravel in my voice tonight'],['Honey, Late','Mara Oke','Soul',84,'A\u266d maj',224,'Honey, it\u2019s late, stay'],['Satellite Kid','Nu Basin','Hip-Hop',96,'C min',178,'Satellite kid on a rooftop'],['Glasshouse','Wren & Ivy','Indie folk',104,'D maj',209,'We built a glasshouse anyway'],['Rust Belt Radio','Cal Moreno','Country',118,'G maj',197,'Rust belt radio, one bar left'],['Undertow','Pale Coast','Dream pop',76,'B min',243,'Pulled under, didn\u2019t mind']];
DIG.forEach(([t,a,g,bpm,key,d,ly],i)=>{S['dg'+i]={t,a,ar:a,art:'d'+(i+1),d,bpm,key,genre:g,hook:Math.round(d*.32),ly:ly?[ly]:null}});
SRC.dug={type:'Playlist',name:'Dug',art:'d1',q:[]};SRC.digfull={type:'Dig',name:'Today\u2019s dig',art:'d1',q:DIG.map((_,i)=>'dg'+i)};
const DG={i:0,kept:[],skipped:[],t:0,on:false,open:false,wasOn:false,from:null,HOOK:15};
function digHomeR(){const left=DIG.length-DG.i,done=left===0,k=DG.kept.length;const nx=DIG.slice(DG.i,DG.i+3);
 $('digHome').innerHTML=`<div class="dgh-l"><div class="dgh-t"><h2>Dig</h2><span class="m">${pad(Math.min(DG.i+1,DIG.length))}/${DIG.length}</span></div><p>${done?`Done for today. You kept ${k} of ${DIG.length}. A new stack arrives tomorrow.`:DG.i?`${left} songs left in today\u2019s stack · ${k} kept`:'10 songs you have never played. Hear the hook, keep what hits.'}</p>
 <div class="dgh-a">${done?(k?`<button class="btn pri" id="digPlayDug">${ICON('play')}Play Dug</button>`:''):`<button class="btn pri" id="digGo">${ICON('play')}${DG.i?'Continue digging':'Start digging'}</button>`}<span class="dgh-k">${DIG.map((_,j)=>`<i class="${DG.kept.includes(j)?'k':DG.skipped.includes(j)?'s':''}"></i>`).join('')}</span></div></div>
 <div class="dgh-s">${(done?DG.kept.slice(-3).map(j=>'d'+(j+1)):nx.map((_,j)=>'d'+(DG.i+j+1))).reverse().map((a,j,arr)=>`<span class="cover" style="--o:${arr.length-1-j}">${svg(a)}</span>`).join('')}</div>`;
 const g=$('digGo');if(g)g.onclick=digOpen;const p=$('digPlayDug');if(p)p.onclick=()=>startSrc('dug',0);}
function dugSide(){let el=$('dugLi');if(!DG.kept.length){if(el)el.remove();return}if(!el){el=document.createElement('button');el.className='li';el.id='dugLi';el.dataset.src='dug';$('pls').after(el)}
 el.innerHTML=`<span class="cover">${svg('d'+(DG.kept[0]+1))}</span><div><b>Dug</b><span>${DG.kept.length} song${DG.kept.length>1?'s':''} · from Dig</span></div><span class="eq"><i></i><i></i><i></i></span>`}
function tabOn(t){document.querySelectorAll('.tabs [data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===t))}
function digOpen(){DG.open=true;tabOn('Dig');DG.wasOn=st.on;DG.from=curK();if(st.on){st.on=false;render()}$('dig').classList.add('open');document.body.classList.add('digging');digR();digPlay(true)}
function digClose(){DG.open=false;tabOn('Home');DG.on=false;$('dig').classList.remove('open');document.body.classList.remove('digging');digHomeR();if(DG.wasOn)toast('Paused '+S[DG.from].t+' while you dug','Resume',()=>{st.on=true;render();$('toast').classList.remove('open')})}
function digPlay(reset){if(DG.i>=DIG.length)return;if(reset)DG.t=0;if(DG.t>=DG.HOOK)DG.t=0;DG.on=true;digSync()}
function digCard(i,pos){const s=S['dg'+i];return `<div class="dgc" data-pos="${pos}" style="--tone:${TONE[s.art]}"><span class="cover">${svg(s.art)}</span><div class="dgc-i"><b>${s.t}</b><span>${s.a}</span><div class="tags m"><span>${s.genre}</span><span>${s.bpm} BPM</span><span>${s.key}</span></div></div><span class="dgc-st dgc-keep">Keep</span><span class="dgc-st dgc-skip">Skip</span></div>`}
function digR(){const b=$('digBody');if(DG.i>=DIG.length){b.innerHTML=`<div class="dg-end"><h3>Done for today</h3><p>You kept ${DG.kept.length} of ${DIG.length}. They are in <b>Dug</b> in your playlists. A new stack arrives tomorrow.</p><div class="dg-endl">${DG.kept.map(j=>{const s=S['dg'+j];return `<div class="dq"><span class="cover">${svg(s.art)}</span><div><b>${s.t}</b><span>${s.a} · ${s.genre}</span></div><span class="m">${fmt(s.d)}</span></div>`}).join('')||'<p class="mut">Nothing kept today. Tomorrow\u2019s stack is different.</p>'}</div><div class="dg-acts">${DG.kept.length?`<button class="btn pri" id="dgPlayDug">${ICON('play')}Play Dug</button>`:''}<button class="btn gh" id="dgDone">Close</button></div></div>`;
  const p=$('dgPlayDug');if(p)p.onclick=()=>{DG.wasOn=false;digClose();startSrc('dug',0)};$('dgDone').onclick=digClose;$('digCount').textContent=`${DIG.length}/${DIG.length}`;digSeg();return}
 b.innerHTML=`<div class="dg-stack">${[2,1].filter(o=>DG.i+o<DIG.length).map(o=>digCard(DG.i+o,o)).join('')}${digCard(DG.i,0)}</div>
 <div class="dg-hook"><button class="dg-pp" id="dgPP" aria-label="Play hook"><svg class="dg-ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" class="bg"/><circle cx="32" cy="32" r="30" class="fg" id="dgRing"/></svg><span id="dgPPi"></span></button><div><b id="dgHookTx"></b><span class="m" id="dgHookT"></span></div><button class="lnk" id="dgFull">Play full song</button></div>
 <div class="dg-acts"><button class="dg-b skip" id="dgSkip" aria-label="Skip (left arrow)">${ICON('x')}<span>Skip</span><kbd class="m">\u2190</kbd></button><button class="dg-b keep" id="dgKeep" aria-label="Keep (right arrow)">${ICON('heart').replace('class="ic"','class="ic f"')}<span>Keep</span><kbd class="m">\u2192</kbd></button></div>`;
 $('digCount').textContent=`${pad(DG.i+1)}/${DIG.length}`;digSeg();
 $('dgPP').onclick=()=>{DG.on?(DG.on=false,digSync()):digPlay(false)};$('dgSkip').onclick=()=>digDecide(false);$('dgKeep').onclick=()=>digDecide(true);
 $('dgFull').onclick=()=>{const i=DG.i;DG.wasOn=false;digClose();startSrc('digfull',i)};
 digDrag(b.querySelector('.dgc[data-pos="0"]'));digSync()}
function digSeg(){$('digSeg').innerHTML=DIG.map((_,j)=>`<i class="${DG.kept.includes(j)?'k':DG.skipped.includes(j)?'s':j===DG.i?'a':''}"></i>`).join('')}
function digSync(){if(DG.i>=DIG.length)return;const s=S['dg'+DG.i],p=DG.t/DG.HOOK;const r=$('dgRing');if(!r)return;r.style.strokeDashoffset=188.5*(1-p);$('dgPPi').innerHTML=ICON(DG.on?'pause':'play');$('dgPP').setAttribute('aria-label',DG.on?'Pause hook':'Play hook');
 $('dgHookTx').textContent=DG.t>=DG.HOOK?'Hook ended · tap to replay':DG.on?'Playing the hook':'Hook paused';$('dgHookT').textContent=`Hook ${fmt(s.hook)}\u2013${fmt(s.hook+DG.HOOK)} \u00b7 ${Math.ceil(DG.HOOK-DG.t)}s left`;document.getElementById('dig').classList.toggle('live',DG.on)}
setInterval(()=>{if(!DG.open||!DG.on)return;DG.t+=.25;if(DG.t>=DG.HOOK){DG.t=DG.HOOK;DG.on=false}digSync()},250);
function digDecide(keep){if(DG.i>=DIG.length)return;const card=$('digBody').querySelector('.dgc[data-pos="0"]');if(card){card.classList.add(keep?'out-r':'out-l')}
 const i=DG.i;(keep?DG.kept:DG.skipped).push(i);if(keep){SRC.dug.q.push('dg'+i);dugSide()}
 toast(keep?`Kept ${S['dg'+i].t} · added to Dug`:`Skipped ${S['dg'+i].t}`,'Undo',()=>{(keep?DG.kept:DG.skipped).pop();if(keep){SRC.dug.q.pop();dugSide()}DG.i=i;if(DG.open)digR(),digPlay(true);else digHomeR();$('toast').classList.remove('open')});
 setTimeout(()=>{DG.i++;digR();digPlay(true);digHomeR()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:260)}
function digDrag(card){if(!card)return;let x0=null,dx=0;card.onpointerdown=e=>{if(e.target.closest('button'))return;x0=e.clientX;dx=0;card.setPointerCapture(e.pointerId);card.classList.add('drag')};
 card.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;card.style.transform=`translateX(${dx}px) rotate(${dx/22}deg)`;card.style.setProperty('--kv',Math.max(0,Math.min(1,dx/110)));card.style.setProperty('--sv',Math.max(0,Math.min(1,-dx/110)))};
 card.onpointerup=card.onpointercancel=()=>{if(x0===null)return;x0=null;card.classList.remove('drag');if(Math.abs(dx)>90){card.style.transform='';digDecide(dx>0)}else{card.style.transform='';card.style.setProperty('--kv',0);card.style.setProperty('--sv',0)}}}
{const dg=document.createElement('section');dg.className='dig';dg.id='dig';dg.setAttribute('role','dialog');dg.setAttribute('aria-label','Dig');dg.innerHTML=`<div class="dg-top"><div><h3>Dig</h3><span class="mut">Today\u2019s stack · songs you have never played</span></div><span class="m" id="digCount"></span><button class="icb" id="digX" aria-label="Close Dig">${ICON('x')}</button></div><div class="dg-seg" id="digSeg"></div><div id="digBody"></div><p class="dg-note">Hooks are 15 seconds. Your music is paused while you dig.</p>`;document.body.appendChild(dg);$('digX').onclick=digClose;
 const home=document.createElement('section');home.className='rise dgh';home.id='digHome';home.dataset.f='all music';home.style.animationDelay='.11s';document.querySelector('.row2').after(home)}
document.addEventListener('keydown',e=>{if(!DG.open)return;if(e.key==='Escape'){digClose();e.stopImmediatePropagation();e.preventDefault()}else if(e.key==='ArrowLeft'){digDecide(false);e.stopImmediatePropagation();e.preventDefault()}else if(e.key==='ArrowRight'){digDecide(true);e.stopImmediatePropagation();e.preventDefault()}else if(e.code==='Space'){$('dgPP')&&$('dgPP').click();e.stopImmediatePropagation();e.preventDefault()}},true);
/* playing anything from outside Dig closes it truthfully */
{const _ss=startSrc;startSrc=function(k,i){if(DG.open){DG.wasOn=false;digClose()}_ss(k,i)}}

/* -- phone layout (<=640px): bottom tabs, mini player, filter row inside Home -- */
{const tabs=document.createElement('nav');tabs.className='tabs';tabs.setAttribute('aria-label','Main');tabs.innerHTML=[['home','Home',1],['journey','Journeys'],['sparkle','Dig'],['lib','Library']].map(([i,t,on])=>`<button class="${on?'on':''}" data-tab="${t}">${ICON(i)}<span>${t}</span></button>`).join('');document.body.appendChild(tabs);
 tabs.onclick=e=>{const b=e.target.closest('[data-tab]');if(!b)return;const t=b.dataset.tab;if(t==='Dig')return digOpen();if(t==='Home'){if(DG.open)digClose();if($('np').classList.contains('open'))npClose();$('main').scrollTo({top:0});return}toast(t+' is designed in a later step')};
 const mq=matchMedia('(max-width:640px)');const seg=$('seg'),tb=document.querySelector('.tb');function place(){if(mq.matches){$('main').prepend(seg)}else{tb.insertBefore(seg,tb.querySelector('.r'))}movePill(seg.querySelector('.on'))}mq.addEventListener('change',place);place();
 document.querySelector('.bar .cur').addEventListener('click',()=>{if(mq.matches)npOpen()});}

/* follow chip reflects the current artist (Dig songs are new artists) */
{const _r4=render;render=function(){_r4();const f=$('fol'),nw=curK().startsWith('dg');if(f.dataset.k!==curK()){f.dataset.k=curK();f.classList.toggle('on',!nw);f.textContent=nw?'Follow':'Following'}}}
/* boot rev 4 */
digHomeR();skSync();
if(D.dig){if(D.digI){for(let j=0;j<D.digI;j++){(D.digKeep||[]).includes(j)?(DG.kept.push(j),SRC.dug.q.push('dg'+j)):DG.skipped.push(j)}DG.i=D.digI;dugSide();digHomeR()}if(D.dig!=='home'){digOpen();if(D.digT){DG.t=D.digT;DG.on=D.digOn??true;digSync()}}}

/* ===== rev 5 (2026-10-07, D-066 proposal): Explore page. Home = your music; Explore = everything past it. ===== */
/* Rules: every row is a finite source; every "because" line is computed from real metadata (tempo, key, credits) — no guessing. */
const XP={view:'home',tu:{tempo:'any',voice:'any',feel:'any'},seed:null};
const POOL=()=>Object.keys(S);
const isMin=k=>/min/.test(S[k].key||'');
const TU_OPT={tempo:[['any','Any'],['slow','Slow'],['mid','Mid'],['fast','Fast']],voice:[['any','Any'],['vox','Vocals'],['inst','No vocals']],feel:[['any','Any'],['bright','Bright'],['dark','Dark']]};
const TU_LBL={tempo:'Tempo',voice:'Voice',feel:'Feel'},TU_HINT={slow:'under 95 BPM',mid:'95\u2013120 BPM',fast:'over 120 BPM',vox:'has lyrics',inst:'instrumental',bright:'major keys',dark:'minor keys'};
function tuMatch(){const t=XP.tu;return POOL().filter(k=>{const s=S[k];if(t.tempo==='slow'&&!(s.bpm<95))return false;if(t.tempo==='mid'&&!(s.bpm>=95&&s.bpm<=120))return false;if(t.tempo==='fast'&&!(s.bpm>120))return false;if(t.voice==='vox'&&!s.ly)return false;if(t.voice==='inst'&&s.ly)return false;if(t.feel==='bright'&&isMin(k))return false;if(t.feel==='dark'&&!isMin(k))return false;return true}).sort((a,b)=>S[a].bpm-S[b].bpm)}
function tuKey(){const t=XP.tu;return 'tu_'+t.tempo+'_'+t.voice+'_'+t.feel}
function tuName(){const t=XP.tu,p=['tempo','voice','feel'].filter(d=>t[d]!=='any').map(d=>TU_OPT[d].find(o=>o[0]===t[d])[1]);return p.length?p.join(' \u00b7 '):'Everything'}
function tuR(){const q=tuMatch(),k=tuKey(),min=Math.round(q.reduce((a,x)=>a+S[x].d,0)/60),live=st.src===k,why=['tempo','voice','feel'].filter(d=>XP.tu[d]!=='any').map(d=>TU_HINT[XP.tu[d]]).join(', ');
 if(q.length)SRC[k]={type:'Mix',name:'Tuned: '+tuName(),art:S[q[0]].art,q};
 $('xpTune').classList.toggle('live',live);$('xpTune').innerHTML=`<div class="xp-ch"><h2>Tune a mix</h2><span class="m">${live?(st.on?'playing \u00b7 ':'paused \u00b7 '):''}${q.length} song${q.length===1?'':'s'}${q.length?' \u00b7 '+min+' min':''}</span></div>
 <div class="tu-d">${Object.keys(TU_OPT).map(d=>`<div class="tu-r"><span>${TU_LBL[d]}</span><div class="tu-s" role="radiogroup" aria-label="${TU_LBL[d]}">${TU_OPT[d].map(([v,l])=>`<button role="radio" aria-checked="${XP.tu[d]===v}" class="${XP.tu[d]===v?'on':''}" data-tu="${d}:${v}">${l}</button>`).join('')}</div></div>`).join('')}</div>
 <div class="tu-f"><div class="tu-st">${q.slice(0,7).map(x=>`<span class="cover">${svg(S[x].art)}</span>`).join('')}${q.length>7?`<span class="tu-more m">+${q.length-7}</span>`:''}</div>
 <p class="mut">${q.length?(why?'Songs with '+why+'. ':'All '+q.length+' songs. ')+'Slowest first; the mix ends when the list ends.':'Nothing matches all three. Loosen one dial.'}</p>
 <button class="btn pri" id="tuPlay" ${q.length?'':'disabled'}>${ICON(live&&st.on?'pause':'play')}${live?(st.on?'Pause':'Resume'):'Play mix'}</button></div>`;
 $('tuPlay').onclick=()=>{if(!q.length)return;live?toggleSrc(k):startSrc(k,0)}}
const gfSeed=()=>st.src.startsWith('gf_')?st.src.split('_').slice(2).join('_'):curK();
/* while a Go-from mix plays, its seed stays put so the card you pressed doesn't vanish */
function gfR(){const k0=gfSeed(),s0=S[k0];XP.seed=k0;const others=POOL().filter(k=>k!==k0&&S[k].t!==s0.t);
 const tq=others.slice().sort((a,b)=>Math.abs(S[a].bpm-s0.bpm)-Math.abs(S[b].bpm-s0.bpm)).slice(0,6);const lo=Math.min(...tq.map(x=>S[x].bpm)),hi=Math.max(...tq.map(x=>S[x].bpm));
 const kq=others.filter(k=>isMin(k)===isMin(k0)).sort((a,b)=>(S[b].key===s0.key)-(S[a].key===s0.key)||Math.abs(S[a].bpm-s0.bpm)-Math.abs(S[b].bpm-s0.bpm)).slice(0,8);const same=kq.filter(k=>S[k].key===s0.key).length;
 const co=s0.a.split(/, /).filter(n=>n!==s0.ar);const cq=co.length?others.filter(k=>co.some(n=>S[k].a.includes(n))):others.filter(k=>S[k].ar===s0.ar);
 const cards=[['t',`Same tempo`,`${tq.length} songs at ${lo===hi?lo:lo+'\u2013'+hi} BPM, closest to ${s0.bpm} first`,tq],['k',`Same ${isMin(k0)?'dark':'bright'} keys`,`${kq.length} songs in ${isMin(k0)?'minor':'major'} keys${same?`, ${same} in ${s0.key}`:''}`,kq],['c',co.length?`More with ${co[0]}`:`More from ${s0.ar}`,co.length?`${co[0]} is credited on ${s0.t}`:`${cq.length} more song${cq.length===1?'':'s'} by ${s0.ar}`,cq]].filter(c=>c[3].length);
 cards.forEach(([id,n,_,q])=>{const key='gf_'+id+'_'+k0;if(st.src!==key)SRC[key]={type:'Mix',name:n+' \u00b7 from '+s0.t,art:S[q[0]].art,q}});
 $('xpGo').innerHTML=`<div class="hd"><h2>Go from <span class="xp-seed">${s0.t}</span></h2><span class="m mut">${s0.bpm} BPM \u00b7 ${s0.key} \u00b7 ${s0.a}</span></div><div class="gf">${cards.map(([id,n,why,q])=>`<button class="gfc" data-xs="gf_${id}_${k0}"><span class="gf-stk">${q.slice(0,3).map(x=>`<span class="cover">${svg(S[x].art)}</span>`).join('')}</span><div><b>${n}</b><span>${why}</span></div><span class="pb">${ICON('play')}</span></button>`).join('')}</div>`}
const XG=()=>X.moreG?GJ:GJ.concat(GX);
function xgR(){const inJ=!!SRC[st.src].journey;$('xpG').innerHTML=XG().map(([g,c,a,d,n,src])=>`<button class="xg${src&&inJ&&st.on?' live':''}" style="background:${c}" ${src?'data-xs="journey"':`data-soon="${g} Journey"`}><span class="xg-stk">${a.slice(0,3).map(x=>`<span class="cover">${svg(x)}</span>`).join('')}</span><b>${g}</b><span class="xg-m">${d?`${d} of ${n} artists`:`${n} artists \u00b7 Journey`}</span>${d?`<span class="bar3"><i style="width:${d/n*100}%"></i></span>`:''}<span class="xg-c">${src?(inJ?(st.on?'Pause':'Resume'):'Resume'):'Start'}</span></button>`).join('')}
Object.assign(SRC,{x_static:{type:'Single',name:'Static Bloom',art:'d2',q:['dg1']},x_sat:{type:'Single',name:'Satellite Kid',art:'d7',q:['dg6']},x_glass:{type:'EP',name:'Glasshouse',art:'d8',q:['dg7','dg9']}});
const XREL=[['x_static','Single \u00b7 Today',0],['silver','EP \u00b7 2d ago',1],['x_sat','Single \u00b7 3d ago',0],['soft','Single \u00b7 5d ago',1],['x_glass','EP \u00b7 6d ago',0]];
const XKEPT=[[5,71],[7,64],[0,58],[9,55],[6,49]];
function xlR(){$('xpRel').innerHTML=XREL.map(([k,m,f])=>{const s=SRC[k];return `<button class="xl" data-xs="${k}"><span class="cover">${svg(s.art)}<span class="pb">${ICON('play')}</span></span><div><b>${s.name}</b><span>${S[s.q[0]].a}</span></div><span class="m xl-m">${m}</span>${f?'<span class="xl-f">Following</span>':''}</button>`}).join('');
 $('xpKept').innerHTML=XKEPT.map(([i,p],n)=>{const s=S['dg'+i];return `<button class="xl xk" data-xk="${i}"><span class="xk-n m">${n+1}</span><span class="cover">${svg(s.art)}<span class="pb">${ICON('play')}</span></span><div><b>${s.t}</b><span>${s.a} \u00b7 ${s.genre}</span></div><span class="xk-p"><span class="bar3"><i style="width:${p}%"></i></span><span class="m">${p}% kept</span></span></button>`}).join('')}
function xdR(){const left=DIG.length-DG.i,k=DG.kept.length,done=!left;$('xpDig').innerHTML=`<div class="xp-ch"><h2>Dig</h2><span class="m">${done?'done':DG.i?`${DG.i}/${DIG.length}`:'new today'}</span></div><p class="mut">${done?`You kept ${k} of ${DIG.length}. A new stack arrives tomorrow.`:`${left} songs you have never played. 15 seconds each. Keep what hits.`}</p>
 <div class="xd-fan">${(done?DG.kept.slice(-3).map(j=>'d'+(j+1)):[0,1,2].filter(j=>DG.i+j<DIG.length).map(j=>'d'+(DG.i+j+1))).reverse().map((a,j,arr)=>`<span class="cover" style="--o:${arr.length-1-j}">${svg(a)}</span>`).join('')}</div>
 <div class="xd-a">${done?(k?`<button class="btn pri" id="xdDug">${ICON('play')}Play Dug</button>`:''):`<button class="btn pri" id="xdGo">${ICON('play')}${DG.i?'Continue digging':'Start digging'}</button>`}<span class="dgh-k">${DIG.map((_,j)=>`<i class="${DG.kept.includes(j)?'k':DG.skipped.includes(j)?'s':''}"></i>`).join('')}</span></div>`;
 const g=$('xdGo');if(g)g.onclick=digOpen;const d=$('xdDug');if(d)d.onclick=()=>startSrc('dug',0)}
function xpStates(){document.querySelectorAll('#xp [data-xs]').forEach(e=>{const on=st.src===e.dataset.xs;e.classList.toggle('on',on);const pb=e.querySelector('.pb');if(pb)pb.innerHTML=ICON(on&&st.on?'pause':'play')});
 document.querySelectorAll('#xp [data-xk]').forEach(e=>{const on=st.src==='digfull'&&st.i===+e.dataset.xk;e.classList.toggle('on',on);e.querySelector('.pb').innerHTML=ICON(on&&st.on?'pause':'play')})}
function xpR(){if(!$('xp'))return;tuR();gfR();xgR();xlR();xdR();xpStates()}
{const x=document.createElement('div');x.id='xp';x.className='xp';x.setAttribute('aria-label','Explore');
 x.innerHTML=`<div class="xp-h"><h1>Explore</h1><button class="xp-s" id="xpSearch">${ICON('search')}<span>Artists, songs, genres, playlists</span><span class="m">\u2318K</span></button>
 <div class="xp-rc"><span class="mut">Recent</span>${['Moni Gray','Silver Weather','lo-fi','Mira Son'].map(r=>`<button class="chip2" data-rq="${r}">${r}</button>`).join('')}</div></div>
 <div class="xp-top"><section class="xp-card xp-dig" id="xpDig"></section><section class="xp-card xp-tune" id="xpTune"></section></div>
 <section class="xp-go" id="xpGo"></section>
 <section><div class="hd"><h2>Genres</h2><span class="mut">Each genre is a Journey, artist by artist</span></div><div class="xg-g" id="xpG"></div></section>
 <div class="xp-two"><section><div class="hd"><h2>Out this week</h2><span class="mut">New releases, followed or not</span></div><div class="xls" id="xpRel"></div></section>
 <section><div class="hd"><h2>Most kept in Dig</h2><span class="mut">Across Rondo \u00b7 this week</span></div><div class="xls" id="xpKept"></div></section></div>`;
 $('main').appendChild(x);
 x.addEventListener('click',e=>{const tu=e.target.closest('[data-tu]');if(tu){const [d,v]=tu.dataset.tu.split(':');XP.tu[d]=v;tuR();return}
  const xs=e.target.closest('[data-xs]');if(xs){e.stopPropagation();const k=xs.dataset.xs;st.src===k?toggleSrc(k):startSrc(k,0);return}
  const xk=e.target.closest('[data-xk]');if(xk){e.stopPropagation();startSrc('digfull',+xk.dataset.xk);return}
  const rq=e.target.closest('[data-rq]');if(rq){palOpen();$('palIn').value=rq.dataset.rq;palRender();return}});
 $('xpSearch').onclick=palOpen;}
function setView(v){XP.view=v;document.body.classList.toggle('v-xp',v==='explore');document.querySelectorAll('.side .nav button').forEach(b=>b.classList.toggle('on',b.dataset.nav===v));tabOn(v==='explore'?'Explore':'Home');if(v==='explore')xpR();$('main').scrollTo({top:0,behavior:'instant'})}
{const nav=document.querySelector('.side .nav');nav.innerHTML=[['home','Home','home'],['explore','Explore','explore'],['journey','Journeys','journeys'],['lib','Library','library']].map(([i,t,v])=>`<button data-nav="${v}" class="${v==='home'?'on':''}">${ICON(i)}${t}</button>`).join('');
 nav.onclick=e=>{const b=e.target.closest('[data-nav]');if(!b)return;const v=b.dataset.nav;if(v==='home'||v==='explore'){if(DG.open)digClose();setView(v)}else toast(b.textContent+' is designed in a later step')};
 const tabs=document.querySelector('.tabs');tabs.innerHTML=[['home','Home'],['explore','Explore'],['journey','Journeys'],['lib','Library']].map(([i,t])=>`<button class="${t==='Home'?'on':''}" data-tab="${t}">${ICON(i)}<span>${t}</span></button>`).join('');
 tabs.onclick=e=>{const b=e.target.closest('[data-tab]');if(!b)return;const t=b.dataset.tab;if(DG.open)digClose();if($('np').classList.contains('open'))npClose();if(t==='Home'||t==='Explore')return setView(t.toLowerCase());toast(t+' is designed in a later step')};
 const _dc=digClose;digClose=function(){_dc();tabOn(XP.view==='explore'?'Explore':'Home');if(XP.view==='explore')xdR()};$('digX').onclick=()=>digClose();
 const _dt=tabOn;tabOn=function(t){_dt(t==='Dig'?(XP.view==='explore'?'Explore':'Home'):t)};
 const _dh=digHomeR;digHomeR=function(){_dh();if(XP.view==='explore'&&$('xpDig'))xdR()};
 const _r5=render;render=function(){_r5();if(XP.view!=='explore')return;if(XP.seed!==gfSeed())gfR();tuR();xgR();xpStates()};
 document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;if(anyOpen&&anyOpen())return;if(e.key==='e'&&!e.metaKey&&!e.ctrlKey){setView(XP.view==='explore'?'home':'explore')}});}
/* boot rev 5 */
if(D.view==='explore'){if(D.tu)Object.assign(XP.tu,D.tu);setView('explore');if(D.scroll)setTimeout(()=>$('main').scrollTo({top:D.scroll,behavior:'instant'}),50)}
