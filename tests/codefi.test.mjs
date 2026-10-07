import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createCodefi} from '../src/lib/codefi.mjs';
function fixture({fail=false}={}){
 const events=[],nodes=[],intervals=new Set();
 const parameter=()=>({value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;events.push(['gain',v]);},cancelScheduledValues(){}});
 const node=()=>{const n={gain:parameter(),frequency:parameter(),Q:parameter(),threshold:parameter(),ratio:parameter(),connect(){},disconnect(){n.disconnected=true;},start(){events.push(['voice']);},stop(){n.onended?.();}};nodes.push(n);return n;};
 class Context{constructor(){this.state='suspended';this.currentTime=0;this.sampleRate=8000;this.destination={};events.push(['context']);}createGain(){return node();}createDynamicsCompressor(){return node();}createOscillator(){return node();}createBufferSource(){return node();}createBiquadFilter(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(960)};}async resume(){if(fail)throw new Error('blocked');this.state='running';}async close(){this.state='closed';events.push(['close']);}}
 const clock={setInterval(fn){intervals.add(fn);return fn;},clearInterval(fn){intervals.delete(fn);},setTimeout(fn){fn();}};
 return {Context,clock,events,nodes,intervals};
}
test('optional ambience stays silent before start, then releases scheduler and graph on stop',async()=>{
 const f=fixture(),engine=createCodefi(f.Context,f.clock);assert.equal(f.events.filter(e=>e[0]==='voice').length,0);assert.equal(f.intervals.size,0);
 engine.setVolume(1);await engine.start();assert.ok(f.events.some(e=>e[0]==='gain'&&e[1]===.5));assert.ok(f.events.some(e=>e[0]==='voice'));assert.equal(f.intervals.size,1);
 await engine.stop();assert.equal(f.intervals.size,0);assert.ok(f.nodes.every(n=>n.disconnected));assert.equal(f.events.filter(e=>e[0]==='close').length,1);await engine.stop();assert.equal(f.events.filter(e=>e[0]==='close').length,1);
});
test('a rejected audio start remains silent and can be safely cleaned up',async()=>{
 const f=fixture({fail:true}),engine=createCodefi(f.Context,f.clock);await assert.rejects(engine.start());await engine.stop();assert.equal(f.intervals.size,0);assert.ok(!f.events.some(e=>e[0]==='voice'));
});
