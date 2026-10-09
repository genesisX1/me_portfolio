import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {resolve} from 'node:path';
const built=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import{Intro,ProjectCursor}from'./src/components/MotionDetails';const ready=()=>document.body.dataset.ready='true';createRoot(document.getElementById('root')).render(<><Intro onReady={ready}/><ProjectCursor/></>);`,resolveDir:resolve('.'),loader:'tsx'},bundle:true,write:false,format:'iife',platform:'browser',jsx:'automatic',alias:{'@':resolve('src')},define:{'process.env.NODE_ENV':'"production"'}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function setup(reduced=false,seen=false){return new JSDOM(`<div id="root"></div><img class="portrait portrait-dev" src="portrait.png"><a class="project-card" href="https://example.com">Projet</a><script>${built.outputFiles[0].text.replaceAll('</script','<\\/script')}</script>`,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://portfolio.test',beforeParse(w){if(seen)w.localStorage.setItem('portfolio-intro-completed-v1','1');w.matchMedia=q=>({matches:q.includes('reduced-motion')?reduced:q.includes('any-pointer'),addEventListener(){},removeEventListener(){}});}});}
test('intro : attend le portrait, puis se libère même si son chargement échoue',{timeout:8000},async()=>{
 const dom=setup();const d=dom.window.document;
 try{await sleep(150);assert.ok(d.querySelector('.intro-loading'));await sleep(1600);assert.ok(d.querySelector('.intro-loading'),'Une image non chargée garde les panneaux fermés');await sleep(2600);assert.equal(d.body.dataset.ready,'true');assert.ok(d.querySelector('.intro-leaving'));await sleep(800);assert.ok(d.querySelector('.intro-done'));}finally{dom.window.close();}
});
test('curseur : souris hybride, retour du pointeur natif après scroll, mode réduit',{timeout:4000},async()=>{
 const dom=setup();const w=dom.window,d=w.document;
 try{await sleep(150);assert.ok(d.documentElement.classList.contains('project-cursor-enabled'));assert.equal(d.documentElement.classList.contains('project-cursor-active'),false);
 const event=new w.MouseEvent('pointermove',{bubbles:true,clientX:45,clientY:60});Object.defineProperty(event,'pointerType',{value:'mouse'});d.querySelector('.project-card').dispatchEvent(event);await sleep(60);
 assert.ok(d.querySelector('.project-cursor.is-visible'));assert.ok(d.documentElement.classList.contains('project-cursor-active'));
 w.dispatchEvent(new w.Event('scroll'));assert.equal(d.documentElement.classList.contains('project-cursor-active'),false);
 }finally{dom.window.close();}
 const reduced=setup(true);try{await sleep(150);assert.ok(reduced.window.document.querySelector('.intro-done'));assert.equal(reduced.window.document.documentElement.classList.contains('project-cursor-enabled'),false);}finally{reduced.window.close();}
});

test('intro : une visite terminée garde une transition courte sans bloquer la page',{timeout:3000},async()=>{
 const dom=setup(false,true);try{await sleep(150);assert.ok(dom.window.document.querySelector('.intro-loading.intro-short'));await sleep(1700);assert.ok(dom.window.document.querySelector('.intro-done'),'Même une image manquante libère rapidement une visite suivante');}finally{dom.window.close();}
});

test('intro : une première visite achevée est mémorisée, pas une visite interrompue',{timeout:4000},async()=>{
 const dom=setup();try{await sleep(100);assert.equal(dom.window.localStorage.getItem('portfolio-intro-completed-v1'),null);dom.window.document.querySelector('.portrait').dispatchEvent(new dom.window.Event('load'));await sleep(2400);assert.ok(dom.window.document.querySelector('.intro-done'));assert.equal(dom.window.localStorage.getItem('portfolio-intro-completed-v1'),'1');}finally{dom.window.close();}
});
test('intro : réduire les mouvements ne mémorise pas une introduction jamais jouée',async()=>{
 const dom=setup(true);try{await sleep(100);assert.ok(dom.window.document.querySelector('.intro-done'));assert.equal(dom.window.localStorage.getItem('portfolio-intro-completed-v1'),null);}finally{dom.window.close();}
});

test('intro : un stockage indisponible garde le parcours complet et utilisable',{timeout:4000},async()=>{
 const dom=setup();try{Object.defineProperty(dom.window,'localStorage',{get(){throw new Error('Storage blocked');}});await sleep(100);assert.ok(dom.window.document.querySelector('.intro-loading:not(.intro-short)'));dom.window.document.querySelector('.portrait').dispatchEvent(new dom.window.Event('error'));await sleep(2400);assert.ok(dom.window.document.querySelector('.intro-done'));}finally{dom.window.close();}
});
