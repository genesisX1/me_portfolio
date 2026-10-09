import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {translate,localizedExercises} from '../src/lib/localization.mjs';
import {exercises,challengeDocument,challengeScore} from '../src/lib/codeChallenge.mjs';
import {makeBrief} from '../src/lib/interaction.mjs';
test('English contact brief and project labels remain translated',()=>{
 const fields={name:'Client',email:'client@example.com',service:'Site ou application',message:'A website for my business.'};
 const brief=makeBrief(fields,'en');
 assert.match(brief,/PROJECT REQUEST/);
 assert.match(brief,/Website or application/);
 assert.equal(translate('Voir le projet CIAU — nouvel onglet','en'),'View project CIAU — new tab');
});
test('English challenge fallback and tests agree and preserve the opaque sandbox',async()=>{
 const e=localizedExercises(exercises,'en')[3];let result;
 const js='const projects=[{name:"CIAU"},{name:"Application",technologies:["JavaScript"]}];for(const p of projects){const li=document.createElement("li");li.textContent=p.name+" — "+(p.technologies?.length?p.technologies.join(", "):"To be specified");document.querySelector("#projects").append(li);}';
 const doc=challengeDocument(e,{html:e.html,css:e.css,js},'en-token',true);
 assert.match(doc,/connect-src 'none'/);assert.match(e.hint,/To be specified/);
 const d=new JSDOM(doc,{runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.postMessage=data=>{result=data;};}});
 await new Promise(r=>setTimeout(r,100));d.window.close();
 assert.equal(challengeScore(result.results,false),100);assert.match(result.results[0].label,/Both projects/);
});
