"""Rebuild the six authorized Rondo Originals demo recordings.

Requires Python 3, NumPy, and FFmpeg with libmp3lame. The fixed seeds,
44.1 kHz sample rate, and 128 kbps encoder settings keep each musical
arrangement reproducible while encoder metadata may vary by FFmpeg build.
"""
from pathlib import Path
import math, subprocess, wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / 'assets/audio'
AUDIO.mkdir(parents=True, exist_ok=True)
SR = 44100
DURATION = 32.0

TRACKS = [
    {'file':'night-transit.mp3','title':'Night Transit','tempo':142,'root':41,'kind':'trap','seed':101},
    {'file':'continuum.mp3','title':'Continuum','tempo':82,'root':47,'kind':'rnb','seed':102},
    {'file':'blue-hour.mp3','title':'Blue Hour','tempo':92,'root':49,'kind':'ambient','seed':103},
    {'file':'open-circuit.mp3','title':'Open Circuit','tempo':94,'root':43,'kind':'jazzhop','seed':104},
    {'file':'afterimage.mp3','title':'Afterimage','tempo':110,'root':40,'kind':'experimental','seed':105},
    {'file':'first-light-again.mp3','title':'First Light, Again','tempo':78,'root':38,'kind':'jazz','seed':106},
]

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def pan_gains(p):
    p = max(-1, min(1, p))
    return math.sqrt((1-p)/2), math.sqrt((1+p)/2)

def envelope(length, attack=.01, release=.12):
    env = np.ones(length, dtype=np.float64)
    a = min(length, int(attack * SR))
    r = min(length, int(release * SR))
    if a > 1: env[:a] = np.linspace(0, 1, a)
    if r > 1: env[-r:] *= np.linspace(1, 0, r)
    return env

def add_signal(buf, signal, start, amp=.2, pan=0):
    i = max(0, int(start * SR)); j = min(len(buf), i + len(signal))
    if j <= i: return
    signal = signal[:j-i] * amp
    left, right = pan_gains(pan)
    buf[i:j,0] += signal * left
    buf[i:j,1] += signal * right

def tone(freq, dur, wave_kind='sine', attack=.01, release=.12, phase=0):
    length = max(1, int(dur * SR)); t = np.arange(length, dtype=np.float64) / SR
    if wave_kind == 'triangle':
        phase_cycles = (freq*t + phase/(2*np.pi)) % 1
        sig = 2*np.abs(2*phase_cycles - 1) - 1
    elif wave_kind == 'softsaw':
        sig = sum(np.sin(2*np.pi*freq*t*k + phase)/(k*k**.12) for k in range(1,6))
        sig /= 2.15
    elif wave_kind == 'bell':
        sig = np.sin(2*np.pi*freq*t+phase) + .42*np.sin(2*np.pi*freq*2.01*t) + .2*np.sin(2*np.pi*freq*3.97*t)
        sig *= np.exp(-2.4*t/max(.1,dur))
    else:
        sig = np.sin(2*np.pi*freq*t+phase)
    return sig * envelope(length, attack, release)

def add_kick(buf, start, amp, rng):
    dur=.42; length=int(dur*SR); t=np.arange(length)/SR
    phase=2*np.pi*(46*t + 92*(1-np.exp(-18*t))/18)
    sig=np.sin(phase)*np.exp(-9*t)
    sig += .15*rng.normal(0,1,length)*np.exp(-45*t)
    add_signal(buf,sig,start,amp,0)

def add_snare(buf,start,amp,rng,brush=False):
    dur=.36 if brush else .25; length=int(dur*SR); t=np.arange(length)/SR
    noise=rng.normal(0,1,length); noise=np.concatenate(([0],np.diff(noise)))
    sig=noise*np.exp((-12 if brush else -20)*t)
    sig += .2*np.sin(2*np.pi*185*t)*np.exp(-18*t)
    add_signal(buf,sig,start,amp,-.08)

def add_hat(buf,start,amp,rng,open_hat=False,pan=0):
    dur=.22 if open_hat else .065; length=int(dur*SR); t=np.arange(length)/SR
    noise=rng.normal(0,1,length); noise=np.concatenate(([0],np.diff(noise)))
    sig=noise*np.exp((-18 if open_hat else -72)*t)
    add_signal(buf,sig,start,amp,pan)

def add_pad(buf, notes, start, dur, amp, pan_shift=0):
    for idx,note in enumerate(notes):
        sig=tone(midi(note),dur,'sine',attack=.55,release=.8)
        sig += .24*tone(midi(note)*2.002,dur,'sine',attack=.65,release=.7,phase=.7)
        add_signal(buf,sig,start,amp/(len(notes)**.7),max(-.7,min(.7,pan_shift+(idx-(len(notes)-1)/2)*.22)))

def add_bass(buf,note,start,dur,amp,wave_kind='sine'):
    sig=tone(midi(note),dur,wave_kind,attack=.012,release=.16)
    if wave_kind!='sine': sig += .34*tone(midi(note),dur,'sine',attack=.01,release=.18)
    add_signal(buf,sig,start,amp,0)

def render(config):
    rng=np.random.default_rng(config['seed']); n=int(DURATION*SR)
    buf=np.zeros((n,2),dtype=np.float64); beat=60/config['tempo']; bar=beat*4
    root=config['root']; kind=config['kind']
    progressions={
      'trap': [[0,3,7],[0,5,8],[-2,3,7],[-4,3,8]],
      'rnb': [[0,3,7,10],[-2,3,7,10],[-5,0,3,7],[-4,1,5,8]],
      'ambient': [[0,4,7,11],[-2,2,7,9],[-5,0,4,7],[-3,2,5,9]],
      'jazzhop': [[0,3,7,10],[5,9,12,15],[-2,2,5,9],[3,7,10,14]],
      'experimental': [[0,3,6,10],[-1,4,7,11],[-5,0,3,8],[2,5,9,12]],
      'jazz': [[0,3,7,10],[5,9,12,15],[-5,0,4,7],[-2,2,5,9]],
    }[kind]
    bars=int(math.ceil(DURATION/bar))
    for b in range(bars):
        start=b*bar; chord=progressions[b%len(progressions)]
        pad_amp={'trap':.14,'rnb':.17,'ambient':.23,'jazzhop':.12,'experimental':.13,'jazz':.15}[kind]
        add_pad(buf,[root+12+x for x in chord],start,min(bar*1.04,DURATION-start),pad_amp,(-.1 if b%2 else .1))
        bass_root=root+chord[0]-12
        for q in range(4):
            if start+q*beat>=DURATION: continue
            if kind=='ambient' and q not in (0,2): continue
            bass_note=bass_root+(7 if q==3 and b%2 else 0)
            add_bass(buf,bass_note,start+q*beat,beat*(.72 if kind!='jazz' else .88),.27 if kind!='ambient' else .14,'softsaw' if kind in ('trap','experimental') else 'sine')
        for q in range(4):
            t0=start+q*beat
            if t0>=DURATION: continue
            kick_pattern = q in (0,2) or (kind=='trap' and q==3 and b%2) or (kind=='experimental' and q==1 and b%3==0)
            if kick_pattern: add_kick(buf,t0,.42 if kind!='ambient' else .18,rng)
            if q in (1,3): add_snare(buf,t0,.22 if kind not in ('jazz','ambient') else .13,rng,kind=='jazz')
            subdivisions=4 if kind=='trap' else 2
            for h in range(subdivisions):
                ht=t0+h*beat/subdivisions
                if ht<DURATION: add_hat(buf,ht,.055 if kind!='ambient' else .022,rng,open_hat=(kind=='rnb' and q==3 and h==1),pan=(-.45 if h%2 else .45))
        motif=[12,15,19,22,19,15,10,12]
        if kind in ('rnb','ambient','jazz','jazzhop') and b%2==1:
            for m,interval in enumerate(motif):
                st=start+m*beat/2
                if st<DURATION:
                    add_signal(buf,tone(midi(root+interval),beat*.34,'bell',attack=.006,release=.15),st,.075 if kind!='jazz' else .09,pan=(-.55+(m%4)*.35))
        elif kind in ('trap','experimental') and b%2==0:
            for m,interval in enumerate([12,10,15,7]):
                st=start+(m*1.5+.5)*beat
                if st<DURATION:
                    add_signal(buf,tone(midi(root+interval),beat*.48,'bell',attack=.005,release=.2),st,.07,pan=(-.35 if m%2 else .35))
    # short room reflections and gentle stereo widening
    dry=buf.copy()
    for delay,gain,cross in [(int(.055*SR),.16,False),(int(.17*SR),.10,True),(int(.31*SR),.07,False)]:
        if cross:
            buf[delay:,0]+=dry[:-delay,1]*gain; buf[delay:,1]+=dry[:-delay,0]*gain
        else: buf[delay:]+=dry[:-delay]*gain
    # fade and soft master
    fade=int(1.6*SR); buf[-fade:]*=np.linspace(1,0,fade)[:,None]
    buf=np.tanh(buf*1.25)
    peak=float(np.max(np.abs(buf))) or 1
    buf=buf*(.92/peak)
    return (buf*32767).astype(np.int16)

for config in TRACKS:
    out=AUDIO/config['file']; wav_path=out.with_suffix('.wav')
    pcm=render(config)
    with wave.open(str(wav_path),'wb') as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav_path),'-codec:a','libmp3lame','-b:a','128k','-metadata',f"title={config['title']}",'-metadata','artist=Rondo Originals','-metadata','copyright=Original demo audio for the Rondo prototype',str(out)],check=True)
    wav_path.unlink()
    print('generated',out.name,out.stat().st_size)

(AUDIO/'README.md').write_text('''# Rondo original demo audio\n\nThese six recordings are original, procedurally composed demo instrumentals created specifically for the Rondo prototype. They are not copies, rips, or reconstructions of commercial songs. The catalog labels them as **Rondo Originals** and treats them as authorized local demo sources.\n\nFiles: Night Transit, Continuum, Blue Hour, Open Circuit, Afterimage, and First Light, Again. Each file is a 32-second stereo MP3 at 44.1 kHz / 128 kbps.\n''')
