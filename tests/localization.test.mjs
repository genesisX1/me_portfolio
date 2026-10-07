import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {translate,localizedExercises} from '../src/lib/localization.mjs';
import {exercises,challengeDocument,challengeScore} from '../src/lib/codeChallenge.mjs';
import {bookingMessage,requestMailto,tentativeCalendar,formatDay} from '../src/lib/booking.mjs';
import {makeBrief} from '../src/lib/interaction.mjs';
test('English booking exports keep UTC times, tentative status and translated service names',()=>{
 const fields={day:'2026-10-12',time:'09:00',name:'Client',email:'client@example.com',service:'Site ou application',message:'A website for my business.'};
 assert.match(formatDay(fields.day,'en'),/Monday/);
 assert.match(bookingMessage(fields,'en'),/Website or application/);
 assert.match(decodeURIComponent(requestMailto('joackimdate1@gmail.com',fields,'en')),/This time slot is not reserved/);
 const calendar=tentativeCalendar(fields,new Date('2026-10-07T00:00:00Z'),'en');
 assert.match(calendar,/DTSTART:20261012T090000Z/);assert.match(calendar,/STATUS:TENTATIVE/);assert.match(calendar,/TRANSP:TRANSPARENT/);
 assert.match(calendar,/Suggestion only/);assert.match(makeBrief(fields,'en'),/PROJECT REQUEST/);
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
