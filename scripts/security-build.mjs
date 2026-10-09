import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

async function walk(root) {
  const result = [];
  for (const e of await readdir(root, { withFileTypes: true })) {
    const p = join(root, e.name);
    if (e.isDirectory()) result.push(...(await walk(p)));
    else {
      if (e.isSymbolicLink()) throw Error(`Lien symbolique interdit : ${p}`);
      result.push(p);
    }
  }
  return result;
}
const files = await walk('out');
const forbidden =
  /(?:^|\/)(?:\.env[^/]*|\.git|node_modules|package-lock\.json|package\.json|[^/]*\.(?:pem|key|map)|qa-mobile\.html)(?:\/|$)/i;
for (const file of files) {
  if (forbidden.test(file)) throw Error(`Fichier interdit dans la publication : ${file}`);
  if (/\.(?:html|js|json|txt)$/.test(file)) {
    const content = await readFile(file, 'utf8');
    if (
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[A-Z0-9]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{40,}/.test(
        content,
      )
    )
      throw Error(`Secret probable dans la publication : ${file}`);
  }
  if (!file.endsWith('.html') || file === 'out/challenge-runner.html') continue;
  let html = await readFile(file, 'utf8');
  // Embed the generated CSS as a fallback: one static page remains styled even
  // when a browser extension blocks the framework's hashed stylesheet URL.
  const stylePaths = [
    ...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi),
  ].map((m) => m[1]);
  const embeddedStyles = [];
  for (const href of stylePaths) {
    if (!/^\/_next\/static\/chunks\/[^/]+\.css$/.test(href))
      throw Error('Chemin de styles inattendu.');
    embeddedStyles.push(
      (await readFile(join('out', href.slice(1)), 'utf8')).replaceAll('</style', '<\\/style'),
    );
  }
  if (embeddedStyles.length)
    html = html.replace(
      '</head>',
      `<style id="portfolio-styles">${embeddedStyles.join('\n')}</style></head>`,
    );

  const hashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((m) => !/\bsrc\s*=/i.test(m[1]) && m[2])
    .map((m) => `'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
  const policy = `default-src 'none'; script-src 'self' ${[...new Set(hashes)].join(' ')}; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; manifest-src 'self'`;
  html = html.replace(/<meta[^>]+http-equiv="Content-Security-Policy"[^>]*>/gi, '');
  html = html.replace(
    '<head>',
    `<head><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="no-referrer">`,
  );
  await writeFile(file, html);
}
console.log('Sécurité : CSP à empreintes générée et fichiers publiés contrôlés.');
