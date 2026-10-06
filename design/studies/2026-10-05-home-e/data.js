// Demo catalog for design study D. Fictional artists; all counts derive from these arrays.
const S={
 night:{t:'Night Transit',a:'Kairo Vale, Mira Son',ar:'Kairo Vale',art:'night',d:188,bpm:142,key:'F min',ly:['Headlights fold into the rain','and the city hums in a minor key','every signal turning green for us','we don\u2019t stop till the river']},
 open:{t:'Open Circuit',a:'Vale & Lio',ar:'Vale & Lio',art:'open',d:221,bpm:124,key:'A min',ly:null},
 blue:{t:'Blue Hour',a:'Nia Vale',ar:'Nia Vale',art:'blue',d:178,bpm:86,key:'D maj',ly:['Hold the light a little longer','the street is quiet now','blue on the window','blue on your hands']},
 m1:{t:'Small Hours',a:'Moni Gray',ar:'Moni Gray',art:'small',d:252,bpm:92,key:'C min',ly:['Two a.m. and the beat still knocking','neighbours asleep, I\u2019m still talking','pen on the table','page never stopping']},
 m2:{t:'Two A.M.',a:'Moni Gray',ar:'Moni Gray',art:'small',d:201,bpm:88,key:'G min',ly:['Clock says two, I say not yet','one more verse, no regrets']},
 m3:{t:'Pen & Table',a:'Moni Gray',ar:'Moni Gray',art:'small',d:188,bpm:95,key:'C min',ly:['Ink on my hands again']},
 m4:{t:'Neighbours',a:'Moni Gray, Sora K',ar:'Moni Gray',art:'small',d:223,bpm:90,key:'E\u266d maj',ly:['Through the wall I hear the bass']},
 m5:{t:'Quiet Car',a:'Moni Gray',ar:'Moni Gray',art:'small',d:176,bpm:84,key:'F min',ly:null},
 m6:{t:'Last Stop',a:'Moni Gray',ar:'Moni Gray',art:'small',d:240,bpm:91,key:'C min',ly:['Last stop, everybody off']},
 s1:{t:'Silver Weather',a:'Asha North',ar:'Asha North',art:'silver',d:206,bpm:98,key:'E min',ly:['Silver weather over the bay','I left a light on anyway']},
 s2:{t:'Harbor Lights',a:'Asha North',ar:'Asha North',art:'silver',d:192,bpm:96,key:'B min',ly:['Harbor lights keep count']},
 s3:{t:'Low Tide',a:'Asha North',ar:'Asha North',art:'silver',d:214,bpm:90,key:'E min',ly:null},
 s4:{t:'Glass Season',a:'Asha North',ar:'Asha North',art:'silver',d:183,bpm:102,key:'G maj',ly:['Glass season, handle with care']},
 s5:{t:'Anyway',a:'Asha North',ar:'Asha North',art:'silver',d:228,bpm:94,key:'E min',ly:['I\u2019d do it all again anyway']},
 soft:{t:'Soft Collision',a:'Mira Son',ar:'Mira Son',art:'soft',d:169,bpm:104,key:'G maj',ly:['We touch and the room goes quiet']},
 north:{t:'North Window',a:'Nia Vale',ar:'Nia Vale',art:'north',d:197,bpm:90,key:'F maj',ly:['Snow on the north window']},
 margins:{t:'Margins',a:'Sora K',ar:'Sora K',art:'margins',d:184,bpm:128,key:'A\u266d min',ly:null},
 first:{t:'First Light',a:'Theo June',ar:'Theo June',art:'first',d:213,bpm:78,key:'B\u266d maj',ly:null},
};
const TONE={night:'#17223a',open:'#232a1b',blue:'#1a2c4b',small:'#3a1515',silver:'#2a2c29',soft:'#2f2c28',north:'#1a2427',margins:'#2a2722',first:'#3a2a12',cont:'#45200f'};
const SRC={
 late:{type:'Playlist',name:'Late drive',art:'night',q:['night','open','blue','m1','s1','soft','first','north','margins']},
 sunday:{type:'Playlist',name:'Sunday, slow',art:'blue',q:['blue','north','s3','first','s5']},
 focus:{type:'Playlist',name:'Focus, no vocals',art:'open',q:['open','margins','m5','s3','first']},
 liked:{type:'Playlist',name:'Liked songs',art:'night',q:['night','blue','s1','m2','open','soft']},
 journey:{type:'Journey',name:'Hip-Hop Journey · Moni Gray',art:'small',q:['m1','m2','m3','m4','m5','m6'],journey:true},
 silver:{type:'EP',name:'Silver Weather',art:'silver',q:['s1','s2','s3','s4','s5']},
 soft:{type:'Single',name:'Soft Collision',art:'soft',q:['soft']},
 north:{type:'Album',name:'North Window',art:'north',q:['north','blue']},
 margins:{type:'Single',name:'Margins',art:'margins',q:['margins']},
 opens:{type:'Single',name:'Open Circuit',art:'open',q:['open']},
 first:{type:'Single',name:'First Light',art:'first',q:['first']},
 repeat:{type:'Mix',name:'On repeat',art:'night',q:['night','blue','s1','open','m2','first']},
 mood_night:{type:'Mood',name:'Late night',q:['night','blue','north','margins']},
 mood_gym:{type:'Mood',name:'Workout',q:['margins','open','night','m4']},
 mood_focus:{type:'Mood',name:'Focus',q:['open','m5','s3','first']},
 mood_chill:{type:'Mood',name:'Chill',q:['blue','soft','s5','north']},
 mood_sad:{type:'Mood',name:'Sad hours',q:['s3','north','m6','blue']},
 mood_party:{type:'Mood',name:'Party',q:['margins','m4','open','night']},
};
const REPEAT_COUNT={night:14,blue:9,s1:7,open:6,m2:5,first:4};
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const pad=n=>String(n).padStart(2,'0');
