import {test} from 'node:test';
import assert from 'node:assert/strict';
import {alphaHit} from '../src/components/portraitHit.ts';
test('alpha : silhouette, trous transparents, bords et seuil anti-alias',()=>{
 const alpha=new Uint8Array([0,255,0,255,0,255,31,32,255]);
 const rect={left:20,top:30,width:300,height:300};
 assert.equal(alphaHit(alpha,3,3,rect,170,80),true);
 assert.equal(alphaHit(alpha,3,3,rect,170,180),false);
 assert.equal(alphaHit(alpha,3,3,rect,70,280),false);
 assert.equal(alphaHit(alpha,3,3,rect,170,280),true);
 for(const [x,y] of [[19,100],[320,100],[100,29],[100,330]])assert.equal(alphaHit(alpha,3,3,rect,x,y),false);
});
test('contain : marges latérales, marge supérieure et rectangle transformé',()=>{
 const alpha=new Uint8Array(8).fill(255);
 assert.equal(alphaHit(alpha,2,4,{left:10,top:20,width:400,height:400},50,200),false);
 assert.equal(alphaHit(alpha,2,4,{left:10,top:20,width:400,height:400},150,200),true);
 assert.equal(alphaHit(alpha,4,2,{left:10,top:20,width:400,height:400},150,100),false);
 assert.equal(alphaHit(alpha,4,2,{left:10,top:20,width:400,height:400},150,300),true);
 assert.equal(alphaHit(alpha,2,4,{left:100,top:200,width:200,height:200},175,250),true);
});
