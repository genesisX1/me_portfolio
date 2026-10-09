import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const originals = [
  'developer.png',
  'designer.png',
  'projects/ciau.png',
  'projects/cave-du-bourgeois.png',
  'projects/the316tech.png',
  'projects/afripul-support.png',
  'projects/mauvais-temps.png',
  'projects/sceau-origines.png',
];
const manifest = {};
let originalBytes = 0;
let optimizedBytes = 0;

for (const file of originals) {
  const input = resolve('public/images', file);
  const metadata = await sharp(input).metadata();
  const portrait = !file.startsWith('projects/');
  const widths = [...new Set([...(portrait ? [560, 840] : [640, 960, 1440]), metadata.width])]
    .filter((width) => width <= metadata.width)
    .sort((a, b) => a - b);
  const variants = [];

  for (const width of widths) {
    const name = file.replace('.png', `-${width}.webp`);
    const output = resolve('public/images/optimized', name);
    await mkdir(dirname(output), { recursive: true });
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: portrait ? 92 : 88, alphaQuality: 100, effort: 6 })
      .toFile(output);
    variants.push({ src: `/images/optimized/${name}`, width });
  }

  const largest = variants.at(-1);
  manifest[`/images/${file}`] = {
    src: largest.src,
    srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(', '),
  };
  originalBytes += (await stat(input)).size;
  optimizedBytes += (await stat(resolve('public', largest.src.slice(1)))).size;
  console.log(
    `${file}: ${(await stat(input)).size} → ${(await stat(resolve('public', largest.src.slice(1)))).size} bytes`,
  );
}

await writeFile('src/data/optimized-images.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `Full-resolution assets: ${originalBytes} → ${optimizedBytes} bytes (${Math.round((1 - optimizedBytes / originalBytes) * 100)}% saved).`,
);
