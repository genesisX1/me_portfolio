import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {homeEntryScript} from '../src/lib/home-entry.mjs';

function page(url='https://portfolio.example/?source=share#services') {
  const dom=new JSDOM('<html><body><section id="top"></section><section id="services"></section></body></html>',{url,runScripts:'outside-only'});
  const w=dom.window,frames=[],calls=[];
  w.requestAnimationFrame=cb=>{frames.push(cb);return frames.length;};
  w.scrollTo=(x,y)=>calls.push({x,y,behavior:w.document.documentElement.style.getPropertyValue('scroll-behavior')});
  w.history.replaceState({framework:'preserved'},'',w.location.href);
  w.localStorage.setItem('joackim-theme','light');w.localStorage.setItem('joackim-language','en');
  w.eval(homeEntryScript);
  return {dom,w,calls,flush(){while(frames.length)frames.shift()();}};
}
test('Opening an old section URL starts at home without losing query, history state or preferences',()=>{
 const p=page();try{p.flush();assert.equal(p.w.location.hash,'');assert.equal(p.w.location.search,'?source=share');assert.equal(p.w.history.length,1);assert.deepEqual(JSON.parse(JSON.stringify(p.w.history.state)),{framework:'preserved'});assert.equal(p.w.history.scrollRestoration,'manual');assert.ok(p.calls.every(c=>c.x===0&&c.y===0&&c.behavior==='auto'));assert.equal(p.w.localStorage.getItem('joackim-theme'),'light');assert.equal(p.w.localStorage.getItem('joackim-language'),'en');}finally{p.dom.window.close();}
});
test('Navigation during the visit keeps its section and is not cancelled by a pending startup frame',()=>{
 const p=page();try{const count=p.calls.length;p.w.history.pushState(null,'','#services');p.w.dispatchEvent(new p.w.HashChangeEvent('hashchange'));p.flush();p.w.dispatchEvent(new p.w.PageTransitionEvent('pageshow',{persisted:false}));assert.equal(p.w.location.hash,'#services');assert.equal(p.calls.length,count);}finally{p.dom.window.close();}
});
test('Returning from the browser document cache resets the entry without disabling the cache',()=>{
 const p=page();try{p.flush();p.w.history.pushState(null,'','#services');p.w.dispatchEvent(new p.w.Event('pointerdown'));const count=p.calls.length;p.w.dispatchEvent(new p.w.PageTransitionEvent('pageshow',{persisted:true}));p.flush();assert.equal(p.w.location.hash,'');assert.ok(p.calls.length>count);assert.equal(p.w.localStorage.getItem('joackim-theme'),'light');}finally{p.dom.window.close();}
});
test('A visitor scrolling before the page finishes loading is not pulled back to the top',()=>{
 const p=page('https://portfolio.example/');try{p.w.dispatchEvent(new p.w.Event('wheel'));const count=p.calls.length;p.flush();p.w.dispatchEvent(new p.w.PageTransitionEvent('pageshow',{persisted:false}));assert.equal(p.calls.length,count);}finally{p.dom.window.close();}
});
