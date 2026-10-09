import {build} from 'esbuild';
import {homeEntryScript} from '../src/lib/home-entry.mjs';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve('.');
const built=await build({plugins:[{name:'standalone-images',setup(build){build.onLoad({filter:/optimized-images\.json$/},()=>({contents:'{}',loader:'json'}));}}],entryPoints:['scripts/standalone-entry.tsx'],bundle:true,write:false,minify:true,format:'iife',platform:'browser',jsx:'automatic',alias:{'@':resolve('src')},define:{'process.env.NODE_ENV':'"production"'}});
let js=built.outputFiles[0].text;
const runner='data:text/html;base64,'+(await readFile('public/challenge-runner.html')).toString('base64');
js=js.replaceAll(JSON.stringify('/challenge-runner.html'),JSON.stringify(runner));
// Keep the PNG fallback in the offline copy; do not duplicate responsive assets
// inside a single file. The hosted build uses the optimized WebP sources.
const imageManifest=JSON.parse(await readFile('src/data/optimized-images.json','utf8'));
for(const original of Object.keys(imageManifest)){
 const fallback='data:image/png;base64,'+(await readFile(resolve('public',original.slice(1)))).toString('base64');
 js=js.replaceAll(original,fallback);
}
const files=await readdir('out/_next/static/chunks');
const styles=await Promise.all(files.filter(f=>f.endsWith('.css')).map(f=>readFile('out/_next/static/chunks/'+f,'utf8')));
if(!styles.length)throw Error('Lancez npm run build avant de générer la version autonome.');
let embeddedStyles=styles.join('\n');
for(const file of ['portfolio-sans-regular.woff','portfolio-sans-bold.woff','portfolio-mono.woff']){
 const data='data:font/woff;base64,'+(await readFile(resolve('public/fonts',file))).toString('base64');
 embeddedStyles=embeddedStyles.replaceAll('/fonts/'+file,data);
}
const favicon='data:image/svg+xml;base64,'+(await readFile('public/favicon.svg')).toString('base64');
const html=`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><script>${homeEntryScript}</script><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Joackim DATE — Développeur & Designer</title><link rel="icon" href="${favicon}"><style>${embeddedStyles.replaceAll('</style','<\\/style')}</style></head><body><div id="root"></div><noscript>Activez JavaScript pour découvrir les interactions du portfolio.</noscript><script>${js.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile(resolve(root,'OUVRIR-LE-PORTFOLIO.html'),html);
console.log('Version autonome créée : OUVRIR-LE-PORTFOLIO.html ('+(Buffer.byteLength(html)/1024/1024).toFixed(1)+' Mo)');
