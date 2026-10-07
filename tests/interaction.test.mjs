import test from 'node:test';
import assert from 'node:assert/strict';
import {portraitMode,safeExternalUrl,makeBrief,challenges} from '../src/lib/interaction.mjs';
test('le survol temporaire revient au dev sans effacer le choix épinglé',()=>{
 assert.equal(portraitMode(false,false),'dev'); assert.equal(portraitMode(false,true),'design');
 assert.equal(portraitMode(true,false),'design'); assert.equal(portraitMode(true,true),'design');
});
test('les liens à fournir restent désactivés et les protocoles dangereux sont refusés',()=>{
 for(const value of ['', 'javascript:alert(1)','file:///etc/passwd','data:text/html,test']) assert.equal(safeExternalUrl(value),'');
 assert.equal(safeExternalUrl('https://example.com/project'),'https://example.com/project');
});
test('le brief conserve les détails et indique explicitement qu’il n’a pas été envoyé',()=>{
 const text=makeBrief({name:' Joackim ',email:'nom@example.com',service:'Identité',message:'Projet\nDeuxième ligne'});
 assert.match(text,/Nom : Joackim\n/); assert.match(text,/Projet\nDeuxième ligne/);assert.match(text,/Il n’a pas été envoyé/);
});
test('chaque question a une réponse valide et une explication',()=>{
 for(const q of challenges){assert.ok(q.answer>=0&&q.answer<q.choices.length); assert.ok(q.explanation.length>20);}
});
