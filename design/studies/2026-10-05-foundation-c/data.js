const SONGS={
 night:{t:'Night Transit',a:'Kairo Vale, Mira Son',d:188,bpm:142,key:'F min',g:'Hip-Hop',rel:'Blacktop Studies',tone:'#17223a',ly:['Headlights fold into the rain','and the city hums in a minor key','every signal turning green for us','we don\u2019t stop till the river']},
 open:{t:'Open Circuit',a:'Vale & Lio',d:221,bpm:124,key:'A min',g:'Electronic',rel:'Signal Memory',tone:'#232a1b',ly:['Instrumental']},
 blue:{t:'Blue Hour',a:'Nia Vale',d:178,bpm:86,key:'D maj',g:'R&B',rel:'North Window',tone:'#1a2c4b',ly:['Hold the light a little longer','the street is quiet now','blue on the window','blue on your hands']},
 small:{t:'Small Hours',a:'Moni Gray',d:252,bpm:92,key:'C min',g:'Hip-Hop',rel:'Small Hours',tone:'#361515',ly:['Two a.m. and the beat still knocking','neighbours asleep, I\u2019m still talking','pen on the table','page never stopping']},
 silver:{t:'Silver Weather',a:'Asha North',d:206,bpm:98,key:'E min',g:'R&B',rel:'Silver Weather',tone:'#262826',ly:['Silver weather over the bay','I left a light on anyway']},
 soft:{t:'Soft Collision',a:'Mira Son',d:169,bpm:104,key:'G maj',g:'R&B',rel:'Soft Collision',tone:'#2b2926',ly:['We touch and the room goes quiet']},
 first:{t:'First Light',a:'Theo June',d:213,bpm:78,key:'B\u266d maj',g:'Jazz',rel:'First Light',tone:'#36270f',ly:['Instrumental']},
 north:{t:'North Window',a:'Nia Vale',d:197,bpm:90,key:'F maj',g:'R&B',rel:'North Window',tone:'#1a2427',ly:['Snow on the north window']},
 margins:{t:'Margins',a:'Sora K',d:184,bpm:128,key:'A\u266d min',g:'Electronic',rel:'Margins',tone:'#27241f',ly:['Instrumental']},
 cont:{t:'Continuum',a:'Asha North',d:192,bpm:94,key:'D min',g:'R&B',rel:'Continuum',tone:'#45200f',ly:['Round again, round again']}
};
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
