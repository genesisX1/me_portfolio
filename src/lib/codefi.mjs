// Original 72 BPM ambient loop: warm keys, restrained bass and filtered percussion.
// No network, samples or audio graph before the visitor explicitly starts playback.
export function createCodefi(Context,clock=globalThis){
 const context=new Context({latencyHint:'playback'});
 const master=context.createGain(),limiter=context.createDynamicsCompressor();
 master.gain.value=0;limiter.threshold.value=-18;limiter.ratio.value=4;
 master.connect(limiter);limiter.connect(context.destination);
 let timer=null,closed=false,step=0,next=0,volume=.18;
 const beat=60/72,voices=new Set();
 const noise=context.createBuffer(1,context.sampleRate*.12,context.sampleRate);
 const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
 const chords=[[57,60,64,67,71],[53,57,60,64,67],[48,55,59,62,64],[55,59,62,64,69]];
 const frequency=midi=>440*2**((midi-69)/12);
 function voice(midi,time,duration,level,type='sine'){
  const source=context.createOscillator(),gain=context.createGain();source.type=type;source.frequency.value=frequency(midi);
  gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(level,time+.025);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  source.connect(gain);gain.connect(master);voices.add(source);
  source.onended=()=>{source.disconnect();gain.disconnect();voices.delete(source);};source.start(time);source.stop(time+duration+.02);
 }
 function hat(time,level){
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();source.buffer=noise;
  filter.type='bandpass';filter.frequency.value=4200;filter.Q.value=.6;gain.gain.value=level;
  source.connect(filter);filter.connect(gain);gain.connect(master);voices.add(source);
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();voices.delete(source);};source.start(time);source.stop(time+.12);
 }
 function schedule(){
  if(closed||context.state!=='running')return;
  // Skip elapsed beats rather than flooding the graph after a delayed timer.
  if(next<context.currentTime-.2)next=context.currentTime+.03;
  while(next<context.currentTime+.22){
   const chord=chords[Math.floor(step/16)%4],slot=step%16;
   if(slot===0){chord.forEach((note,i)=>{voice(note,next+i*.018,beat*3.8,.055);voice(note+12,next+i*.018,beat*2.4,.011);});}
   if(slot===0||slot===8)voice(chord[0]-24,next,beat*1.8,.12);
   if(slot%4===0){const kick=context.createOscillator(),gain=context.createGain();kick.frequency.setValueAtTime(95,next);kick.frequency.exponentialRampToValueAtTime(42,next+.16);gain.gain.setValueAtTime(.11,next);gain.gain.exponentialRampToValueAtTime(.0001,next+.22);kick.connect(gain);gain.connect(master);voices.add(kick);kick.onended=()=>{kick.disconnect();gain.disconnect();voices.delete(kick);};kick.start(next);kick.stop(next+.24);}
   if(slot%4===2)hat(next,.042);
   if(slot%2===1)hat(next+.025,.016);
   if([3,7,11,14].includes(slot))voice(chord[(Math.floor(slot/4)+2)%chord.length]+12,next,beat*.7,.035);
   step++;next+=beat/2;
  }
 }
 return {
  async start(){if(closed)throw new Error('Audio closed');await context.resume();if(closed)return;if(context.state!=='running')throw new Error('Audio unavailable');next=context.currentTime+.04;master.gain.setTargetAtTime(volume,context.currentTime,.25);schedule();timer=clock.setInterval(schedule,100);},
  setVolume(value){volume=Math.max(0,Math.min(.5,Number.isFinite(value)?value:0));if(!closed)master.gain.setTargetAtTime(volume,context.currentTime,.08);},
  async stop(){if(closed)return;closed=true;if(timer!==null)clock.clearInterval(timer);master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(0,context.currentTime,.025);await new Promise(resolve=>clock.setTimeout(resolve,120));for(const source of voices){try{source.stop();}catch{}source.disconnect();}voices.clear();master.disconnect();limiter.disconnect();await context.close();}
 };
}
