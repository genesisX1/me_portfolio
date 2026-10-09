import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRequest,briefServices,validEmail} from '../src/lib/security.mjs';
import {safeExternalUrl} from '../src/lib/interaction.mjs';
import {validChallengeMessage} from '../src/lib/codeChallenge.mjs';
const valid={name:'Joackim',email:'test@example.com',service:briefServices[0],message:'Un projet clair et utile.'};
test('Payloads de formulaire : rejeter contrôles, faux sujets et dépassements sans altérer le texte',()=>{
 for(const patch of [{name:'Alice\r\nBcc: secret@example.com'},{email:'a@b.com?bcc=secret@example.com'},{service:'Service inventé'},{message:'a'.repeat(6001)},{message:'texte\u0000injecté'},{name:'  '}])assert.throws(()=>validateRequest({...valid,...patch},briefServices));
 const text='<img src=x onerror=alert(1)>\nUn texte à conserver.';
 assert.equal(validateRequest({...valid,message:text},briefServices).message,text);
});
test('Liens externes : bloquer protocoles actifs, HTTP et identifiants intégrés',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,test','http://example.com','https://user:secret@example.com','file:///secret'])assert.equal(safeExternalUrl(url),'');
 assert.equal(safeExternalUrl('https://github.com/genesisX1'),'https://github.com/genesisX1');
});
test('Email : rejeter les injections de destinataire',()=>{
 for(const recipient of ['a@example.com?bcc=x@y.com','a@example.com\r\nBcc:x@y.com'])assert.equal(validEmail(recipient),false);
});
test('Messages du défi : rejeter session fermée, objets malformés et labels géants',()=>{
 for(const data of [{type:'challenge-result',token:'',results:[]},{type:'challenge-result',token:'token',results:[null]},{type:'challenge-result',token:'token',results:[{label:'a'.repeat(301),pass:true}]}])assert.equal(validChallengeMessage(data,data.token),false);
});
