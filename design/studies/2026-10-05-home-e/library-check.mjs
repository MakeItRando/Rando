// Rev 24 Library-specific coverage; the full study suite remains check.mjs.
import {chromium} from 'playwright';
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/local/bin/chromium'}),errors=[],checks=[];
const U=new URL('./home.html?view=library',import.meta.url).href;
const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>errors.push(e.message));
const check=async(name,fn,arg)=>{if(!await p.evaluate(fn,arg))errors.push(name);else checks.push(name)};
await p.goto(U);await p.waitForTimeout(500);await p.evaluate(()=>{st.on=false;setTheme('dark');render()});
await check('direct Library link and populated cover shelves',()=>XP.view==='library'&&!!document.querySelector('.lb-maincards')&&document.querySelectorAll('.lb-artistcards .lb-r').length===FOL.size);
await check('every saved item appears exactly once',()=>{const ids=[...document.querySelectorAll('#lb .lb-r[data-lb]')].map(x=>x.dataset.lb+':'+x.dataset.lid);return new Set(ids).size===ids.length&&ids.length===lbItems().length});
const state=await p.evaluate(()=>JSON.stringify([st.src,st.i,st.t,st.on,st.uq]));
await p.click('[data-lblayout]');await check('list toggle does not alter audio or hide music',s=>LB.layout==='list'&&JSON.stringify([st.src,st.i,st.t,st.on,st.uq])===s&&document.querySelectorAll('.lb-listview .lb-r').length===lbItems().length,state);
await p.click('[data-lblayout]');await check('shelf toggle retains keyboard focus',()=>LB.layout==='shelf'&&document.activeElement.hasAttribute('data-lblayout'));
await p.click('.lb-liked [data-lbp]');await p.waitForTimeout(200);await p.evaluate(()=>{st.t=36;render()});await p.click('.lb-liked [data-lbp]');await check('Liked songs pauses without restarting or opening a page',()=>st.src==='liked'&&!st.on&&st.t>=36&&XP.view==='library');
await p.click('.lb-liked [data-lbp]');await check('Liked songs resumes in place',()=>st.src==='liked'&&st.on&&st.t>=36);await p.evaluate(()=>{st.on=false;render()});
await p.click('.lb-artist[data-lid="Asha North"] [data-lbm]');await p.click('#pop [data-lbx="pin"]');
await check('pinned artist moves to top shelf without duplication',()=>document.querySelectorAll('#lb .lb-r[data-lid="Asha North"]').length===1&&document.querySelector('.lb-maincards [data-lid="Asha North"]')&&document.querySelectorAll('#lb .lb-r[data-lb]')[1].dataset.lid==='Asha North');
await p.click('#toastBtn');await check('Undo pin restores artist shelf',()=>!PIN.ar.includes('Asha North')&&!!document.querySelector('.lb-artistcards [data-lid="Asha North"]'));
await p.click('[data-lbalbumtrack="north"][data-lbtracki="1"]');await p.waitForTimeout(200);
await check('album preview plays the exact album track and bounded queue',()=>st.src==='north'&&st.i===1&&curK()===SRC.north.q[1]&&XP.view==='library');await p.click('[data-lbalbumtrack="north"][data-lbtracki="1"]');await check('album preview toggles pause',()=>!st.on&&st.src==='north'&&st.i===1);
await p.click('[data-lbf="mo"]');await p.click('[data-lbmp="1"]');await p.waitForTimeout(250);
await check('saved moment enters the saved range',()=>st.src==='moments'&&curK()===MOM[1].k&&st.t>=MOM[1].s&&st.t<MOM[1].e);await p.click('[data-lbmp="1"]');const pos=await p.evaluate(()=>st.t);
await p.click('[data-lbmp="1"]');await check('saved moment resumes without restarting',t=>st.on&&st.t>=t,pos);await p.evaluate(()=>{st.on=false;render()});
await p.fill('#lbFind','blue');await check('moment search retains original indices',()=>document.querySelectorAll('[data-lbmp]').length===1&&document.querySelector('[data-lbmp]').dataset.lbmp==='1');await p.fill('#lbFind','');
await p.click('[data-lbmx="0"]');await check('moment delete updates rendered cards',()=>document.querySelectorAll('.lb-memory').length===MOM.length);await p.click('#toastBtn');await check('moment Undo restores rendered cards',()=>document.querySelectorAll('.lb-memory').length===MOM.length);
await p.click('[data-lbf="nt"]');await check('notes empty state is honest',()=>Object.keys(NOTES).length===0&&/No song notes yet/.test(document.querySelector('.lb-none').textContent));
// Seed is explicitly a synthetic QA note, not a screenshot or listening history.
await p.evaluate(()=>{NOTES.night='QA <note> & a train ride';lbR()});await p.fill('#lbFind','train ride');await check('note text participates in Library search',()=>document.querySelectorAll('.lb-notecard').length===1&&/QA <note> & a train ride/.test(document.querySelector('.lb-notecard p').textContent));
await p.click('[data-lbnote="night"]');await check('note edit escapes markup and stays inside viewport',()=>$('snTx').value==='QA <note> & a train ride'&&$('pop').getBoundingClientRect().bottom<=innerHeight-7);
await p.fill('#snTx','QA edited note');await p.click('[data-sns="night"]');await p.fill('#lbFind','');await check('note Save refreshes Library even while paused',()=>NOTES.night==='QA edited note'&&document.querySelector('.lb-notecard p').textContent==='QA edited note');
await p.click('#toastBtn');await check('note Save Undo refreshes Library',()=>NOTES.night==='QA <note> & a train ride'&&document.querySelector('.lb-notecard p').textContent===NOTES.night);
await p.click('[data-lbnote="night"]');await p.click('[data-snd]');await check('note delete updates empty state',()=>!NOTES.night&&!!document.querySelector('.lb-none'));await p.click('#toastBtn');await check('note delete Undo restores card',()=>!!NOTES.night&&!!document.querySelector('.lb-notecard'));
await p.evaluate(()=>{delete NOTES.night;LB.f='all';LB.q='';LB.sort='recent';lbR()});
// Stress the actually editable title and description; no fabricated UI inventory.
for(const w of [1440,1024,768,390,320]){
 await p.setViewportSize({width:w,height:w<641?844:900});await p.evaluate(()=>{SRC.sunday.name='An extremely long playlist name without a convenient break'.slice(0,60);LB.layout='shelf';lbR()});

 await check('no document or Library horizontal overflow at '+w,()=>document.documentElement.scrollWidth<=innerWidth+1&&document.querySelector('#lb').scrollWidth<=document.querySelector('#lb').clientWidth+1);
 await check('44px Library action targets at '+w,()=>[...document.querySelectorAll('#lb button')].filter(x=>x.offsetWidth&&x.offsetHeight).every(x=>{const r=x.getBoundingClientRect();return r.height>=43&&r.width>=43}));
 await p.click('.lb-card[data-lid="sunday"] [data-lbm]');await p.click('#pop [data-lbx="edit"]');await p.waitForTimeout(220);await check('playlist editor within viewport at '+w,()=>{const r=$('pop').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=Math.min(innerHeight,$('main').getBoundingClientRect().bottom)+1});await p.keyboard.press('Escape');
 await p.click('[data-lblayout]');await check('list no overflow at '+w,()=>document.querySelector('#lb').scrollWidth<=document.querySelector('#lb').clientWidth+1);
}
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{SRC.sunday.name='Sunday, slow';LB.layout='shelf';LB.f='all';lbR()});
await p.click('.lb-card[data-lid="late"]');await p.click('#pv [data-pvback]');await check('phone Back retains shelf layout',()=>XP.view==='library'&&LB.layout==='shelf');
await p.evaluate(()=>{LB.f='al';LIB.clear();lbR()});await check('empty albums never fabricates inventory',()=>!document.querySelector('.lb-card')&&!!document.querySelector('.lb-none'));
await p.evaluate(()=>{LB.f='dl';DL.clear();lbR()});await check('offline state never claims real audio storage',()=>/Offline playback is not implemented/.test($('lb').textContent));
await p.emulateMedia({reducedMotion:'reduce'});await p.evaluate(()=>{DL.set('sunday','ing');LB.f='dl';lbR()});await check('Library respects reduced motion',()=>getComputedStyle(document.querySelector('.lb-dl.ing')).animationName==='none');
await p.close();await b.close();console.log(JSON.stringify({passed:checks.length,errors,checks},null,2));process.exit(errors.length?1:0);
