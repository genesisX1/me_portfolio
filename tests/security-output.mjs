import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const html=await readFile('out/index.html','utf8');
const policy=html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
assert.doesNotMatch(policy,/script-src[^;]*'unsafe-(?:eval|inline)'/);
assert.match(policy,/form-action 'none'/);assert.match(policy,/base-uri 'none'/);
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
 if(/\bsrc\s*=/i.test(match[1])||!match[2])continue;
 assert.ok(policy.includes(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`),'Chaque script inline de Next possède son empreinte exacte.');
}
const runner=await readFile('out/challenge-runner.html','utf8');
assert.match(runner,/window\.origin === 'null'/);assert.match(runner,/event\.source!==parent/);
assert.match(runner,/connect-src 'none'/);assert.match(runner,/frame-src 'none'/);
assert.ok((await readdir('out')).includes('challenge-runner.html'));
console.log('OK : empreintes CSP exactes, aucun eval sur le portfolio, exécution réservée au sandbox.');

const cssHref=html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)[1];
assert.equal(html.match(/<style id="portfolio-styles">([\s\S]*?)<\/style>/)[1],(await readFile('out'+cssHref,'utf8')).replaceAll('</style','<\\/style'),'La page embarque exactement les styles vérifiés, sans requête CSS indispensable.');
