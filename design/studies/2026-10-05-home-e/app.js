const $=id=>document.getElementById(id);
const ICON=k=>`<svg class="ic${k==='play'||k==='pause'?' f':''}" viewBox="0 0 24 24">${I[k]}</svg>`;
const st={src:'late',i:0,t:0,on:false,liked:new Set(['night','blue','s1']),pl:{late:SRC.late.q.slice(),sunday:SRC.sunday.q.slice(),focus:SRC.focus.q.slice()},jHeard:new Set()};
const cur=()=>S[SRC[st.src].q[st.i]];const curK=()=>SRC[st.src].q[st.i];
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
function startSrc(k,i=0){if(st.src===k&&st.i===i){st.on=!st.on;return render()}st.src=k;st.i=i;st.t=0;st.on=true;onTrack(true)}
function toggleSrc(k){if(st.src===k){st.on=!st.on;render()}else startSrc(k,0)}
function onTrack(anim){if(SRC[st.src].journey)st.jHeard.add(curK());const s=cur();document.documentElement.style.setProperty('--tone',TONE[s.art]);
 $('stArt').innerHTML=svg(s.art);$('lab').innerHTML=svg(s.art);$('barArt').innerHTML=svg(s.art);
 if(anim){$('stArt').classList.remove('swap');void $('stArt').offsetWidth;$('stArt').classList.add('swap')}lastLy=-1;render()}
function next(manual){const q=SRC[st.src].q;if(st.i<q.length-1){st.i++;st.t=0;onTrack(true)}else{st.on=false;st.t=manual?st.t:cur().d;ended=true;render()}}
let lastLy=-1,ended=false;
function render(){const s=cur(),src=SRC[st.src],q=src.q,k=curK();document.body.classList.toggle('paused',!st.on);document.body.classList.toggle('playing',st.on);
 $('stCap').innerHTML=`${st.on?'<span class="eq"><i></i><i></i><i></i></span>Now playing':'Paused'} · ${src.journey?src.name:src.type+' · '+src.name} · <span class="m" style="letter-spacing:0">${pad(st.i+1)}/${pad(q.length)}</span>`;
 $('stTitle').textContent=s.t;$('stArtist').textContent=s.a;$('barTitle').textContent=s.t;$('barArtist').textContent=s.a;
 const pi=ICON(st.on?'pause':'play');$('bigpp').innerHTML=pi;$('pp').innerHTML=pi;$('bigpp').setAttribute('aria-label',st.on?'Pause':'Play');$('pp').setAttribute('aria-label',st.on?'Pause':'Play');
 const lk=$('like');lk.classList.toggle('on',st.liked.has(k));lk.setAttribute('aria-pressed',st.liked.has(k));
 $('goSrc').textContent=src.journey?'Open Journey':src.type==='Playlist'?'Go to playlist':src.type==='Mix'||src.type==='Mood'?'Open '+src.name:'Go to '+src.type.toLowerCase();
 const li=s.ly?Math.floor(st.t/7)%s.ly.length:-1;if(li!==lastLy){lastLy=li;$('stLyr').innerHTML=`<span>${s.ly?s.ly[li]:'Instrumental'}</span>`}
 const rest=q.slice(st.i+1,st.i+3);$('stNext').innerHTML=`<div class="cap"><span>Up next</span><span>${q.length-st.i-1} left</span></div>`+(rest.length?rest.map((x,j)=>`<button class="qi" data-src="${st.src}" data-i="${st.i+1+j}"><span class="cover">${svg(S[x].art)}</span><div><b>${S[x].t}</b><span>${S[x].a}</span></div></button>`).join(''):`<div class="end">End of ${src.name}. Playback stops here.</div>`);
 tick();
 document.querySelectorAll('[data-src]').forEach(e=>{const same=e.dataset.src===st.src&&(e.dataset.i===undefined||e.classList.contains('qi')?e.dataset.src===st.src:+e.dataset.i===st.i||e.closest('#rels'));const on=e.dataset.src===st.src&&(e.closest('#repeat')?+e.dataset.i===st.i:true);e.classList.toggle('on',on&&!e.classList.contains('qi'));const pb=e.querySelector('.pb');if(pb)pb.innerHTML=ICON(on&&st.on?'pause':'play')});
 document.querySelectorAll('.md').forEach(m=>m.classList.toggle('on',m.dataset.src===st.src&&st.on));
 /* journey state */
 const inJ=!!src.journey,heard=st.jHeard.size;$('jrStat').textContent=`3 of 7 artists · Moni Gray ${heard}/6 songs`;
 $('jrAct').innerHTML=inJ?`<button class="btn gh" id="jOpen">Open Journey</button><button class="btn pri" id="jPP">${ICON(st.on?'pause':'play')}${st.on?'Pause':'Resume'}</button>`:`<button class="btn gh" id="jOpen">Open Journey</button><button class="btn pri" id="jPP">${ICON('play')}${heard?'Resume':'Start'} Moni Gray</button>`;
 $('jPP').onclick=e=>{e.stopPropagation();inJ?(st.on=!st.on,render()):startSrc('journey',heard&&heard<6?heard:0)};$('jOpen').onclick=()=>toast('Journey page is the next design step');
 const node=document.querySelector('.node.c');node.classList.toggle('live',inJ&&st.on);$('ringFg').style.strokeDashoffset=220-220*heard/6;$('curNodeM').textContent=inJ?`Playing · ${heard}/6`:heard?`${heard}/6 heard`:'Next · 6 songs';
 /* drawer */
 $('dSrc').textContent=`Playing from ${src.type} · ${src.name}`;$('dList').innerHTML=q.map((x,j)=>`<button class="dq${j===st.i?' on':j<st.i?' done':''}" data-src="${st.src}" data-i="${j}"><span class="m">${j===st.i&&st.on?'<span class="eq"><i></i><i></i><i></i></span>':pad(j+1)}</span><span class="cover">${svg(S[x].art)}</span><div><b>${S[x].t}</b><span>${S[x].a}</span></div><span class="m">${fmt(S[x].d)}</span></button>`).join('')}
function tick(){const s=cur(),p=st.t/s.d;bars.forEach((b,i)=>b.classList.toggle('p',i/N<p));$('tNow').textContent=fmt(st.t);$('tEnd').textContent=fmt(s.d);$('stProg').style.width=(p*100)+'%';const li=s.ly?Math.floor(st.t/7)%s.ly.length:-1;if(li!==lastLy){lastLy=li;$('stLyr').innerHTML=`<span>${s.ly?s.ly[li]:'Instrumental'}</span>`}}
setInterval(()=>{if(!st.on)return;st.t+=.25;if(st.t>=cur().d)next();else tick()},250);
/* events */
document.addEventListener('click',e=>{const t=e.target.closest('[data-src]');if(!t||t.id==='jPP')return;if(t.classList.contains('li')||t.classList.contains('md')||t.closest('#rels')||t.classList.contains('node'))toggleSrc(t.dataset.src);else startSrc(t.dataset.src,+t.dataset.i||0)});
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)toggleSrc(g.dataset.go)});
$('bigpp').onclick=$('pp').onclick=()=>{if(ended){ended=false;st.i=0;st.t=0;onTrack(true)}st.on=!st.on;render()};
$('next').onclick=()=>next(true);$('prev').onclick=()=>{if(st.t>3||st.i===0){st.t=0;tick()}else{st.i--;st.t=0;onTrack(true)}};
$('wv').onclick=e=>{const r=$('wv').getBoundingClientRect();st.t=(e.clientX-r.left)/r.width*cur().d;tick()};
$('like').onclick=()=>{const k=curK();st.liked.has(k)?st.liked.delete(k):st.liked.add(k);const l=$('like');l.classList.remove('pop');void l.offsetWidth;l.classList.add('pop');toast(st.liked.has(k)?'Added to Liked songs':'Removed from Liked songs');buildSide();render()};
$('fol').onclick=()=>{const f=$('fol');f.classList.toggle('on');f.textContent=f.classList.contains('on')?'Following':'Follow'};
$('qBtn').onclick=()=>{$('drawer').classList.toggle('open');$('qBtn').classList.toggle('on')};
/* add to playlist */
$('addBtn').onclick=e=>{e.stopPropagation();const r=$('addBtn').getBoundingClientRect(),p=$('pop');p.style.left=r.left+'px';p.style.top=(r.bottom+8)+'px';p.innerHTML='<div class="cap">Add to playlist</div>'+['late','sunday','focus'].map(k=>`<button data-add="${k}"><span class="cover">${svg(SRC[k].art)}</span>${SRC[k].name}${st.pl[k].includes(curK())?'<span class="m" style="margin-left:auto;color:var(--t3)">added</span>':''}</button>`).join('')+`<button data-add="new">${ICON('plus')}New playlist</button>`;p.classList.add('open')};
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
/* boot */
buildSide();buildPath();buildChart();buildRepeat();buildMoods();buildRels();movePill(seg.querySelector('.on'));
const D=window.DEMO||{};if(D.src){st.src=D.src;st.i=D.i||0}st.t=D.t??64;st.on=D.on??true;if(D.heard)D.heard.forEach(x=>st.jHeard.add(x));onTrack(false);
if(D.drawer){$('drawer').classList.add('open');$('qBtn').classList.add('on')}if(D.pal){palOpen();$('palIn').value=D.pal;palRender()}if(D.toast)toast(D.toast,'Undo');
if(D.scroll)setTimeout(()=>{$('main').style.scrollBehavior='auto';$('main').scrollTop=D.scroll},50);
