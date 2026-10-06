const SONGS={
 night:{t:'Night Transit',a:'Kairo Vale, Mira Son',art:'night',d:188,bpm:142,key:'F min',g:'Hip-Hop',tone:'#17223a',ly:['Headlights fold into the rain','and the city hums in a minor key','every signal turning green for us','we don\u2019t stop till the river']},
 open:{t:'Open Circuit',a:'Vale & Lio',art:'open',d:221,bpm:124,key:'A min',g:'Electronic',tone:'#232a1b',ly:[]},
 blue:{t:'Blue Hour',a:'Nia Vale',art:'blue',d:178,bpm:86,key:'D maj',g:'R&B',tone:'#1a2c4b',ly:['Hold the light a little longer','the street is quiet now','blue on the window','blue on your hands']},
 small:{t:'Small Hours',a:'Moni Gray',art:'small',d:252,bpm:92,key:'C min',g:'Hip-Hop',tone:'#361515',ly:['Two a.m. and the beat still knocking','neighbours asleep, I\u2019m still talking','pen on the table','page never stopping']},
 mg2:{t:'Paper Walls',a:'Moni Gray',art:'small',d:201,bpm:88,key:'G min',g:'Hip-Hop',tone:'#361515',ly:['Paper walls and a borrowed light']},
 mg3:{t:'Last Train Home',a:'Moni Gray, Kairo Vale',art:'small',d:233,bpm:96,key:'E\u266d min',g:'Hip-Hop',tone:'#361515',ly:['Last train home and I\u2019m wide awake']},
 mg4:{t:'Quiet Money',a:'Moni Gray',art:'small',d:187,bpm:90,key:'C min',g:'Hip-Hop',tone:'#361515',ly:['Quiet money, loud dreams']},
 silver:{t:'Silver Weather',a:'Asha North',art:'silver',d:206,bpm:98,key:'E min',g:'R&B',tone:'#262826',ly:['Silver weather over the bay','I left a light on anyway']},
 s2:{t:'Bay Lights',a:'Asha North',art:'silver',d:194,bpm:92,key:'B min',g:'R&B',tone:'#262826',ly:['Bay lights blinking out of time']},
 s3:{t:'Anyway',a:'Asha North',art:'silver',d:221,bpm:84,key:'E min',g:'R&B',tone:'#262826',ly:['I\u2019d do it all again anyway']},
 soft:{t:'Soft Collision',a:'Mira Son',art:'soft',d:169,bpm:104,key:'G maj',g:'R&B',tone:'#2b2926',ly:['We touch and the room goes quiet']},
 first:{t:'First Light',a:'Theo June',art:'first',d:213,bpm:78,key:'B\u266d maj',g:'Jazz',tone:'#36270f',ly:[]},
 north:{t:'North Window',a:'Nia Vale',art:'north',d:197,bpm:90,key:'F maj',g:'R&B',tone:'#1a2427',ly:['Snow on the north window']},
 margins:{t:'Margins',a:'Sora K',art:'margins',d:184,bpm:128,key:'A\u266d min',g:'Electronic',tone:'#27241f',ly:[]},
};
const SOURCES={
 late:{label:'Playlist',name:'Late drive',total:23,offset:4,tracks:['night','open','blue','small','silver','soft','first','north','margins']},
 journey:{label:'Hip-Hop Journey',name:'Moni Gray',total:14,offset:0,tracks:['small','mg2','mg3','mg4']},
 silverEP:{label:'EP',name:'Silver Weather',total:5,offset:2,tracks:['silver','s2','s3']},
 r_soft:{label:'Single',name:'Soft Collision',total:1,offset:0,tracks:['soft']},
 r_north:{label:'Album',name:'North Window',total:11,offset:0,tracks:['north','blue']},
 r_margins:{label:'EP',name:'Margins',total:4,offset:0,tracks:['margins']},
 r_first:{label:'Single',name:'First Light',total:1,offset:0,tracks:['first']},
};
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
