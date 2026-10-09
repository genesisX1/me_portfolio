// Object-fit: contain, object-position: center bottom. Rect includes CSS transforms.
export function alphaHit(
  alpha: Uint8Array,
  width: number,
  height: number,
  rect: { left: number; top: number; width: number; height: number },
  x: number,
  y: number,
) {
  if (!rect.width || !rect.height) return false;
  const scale = Math.min(rect.width / width, rect.height / height);
  const px = Math.floor((x - rect.left - (rect.width - width * scale) / 2) / scale);
  const py = Math.floor((y - rect.top - (rect.height - height * scale)) / scale);
  return px >= 0 && py >= 0 && px < width && py < height && alpha[py * width + px] >= 32;
}
const masks = new WeakMap<HTMLImageElement, { alpha: Uint8Array; width: number; height: number }>();
export function preparePortrait(image: HTMLImageElement) {
  if (masks.has(image) || !image.naturalWidth) return;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    context.drawImage(image, 0, 0);
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const alpha = new Uint8Array(canvas.width * canvas.height);
    for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4 + 3];
    masks.set(image, { alpha, width: canvas.width, height: canvas.height });
    canvas.width = canvas.height = 0;
  } catch {
    /* If an image cannot be sampled, explicit Code/Design controls remain available. */
  }
}
export function portraitHit(image: HTMLImageElement | null, x: number, y: number) {
  if (!image) return false;
  const mask = masks.get(image);
  if (!mask) return false;
  return alphaHit(mask.alpha, mask.width, mask.height, image.getBoundingClientRect(), x, y);
}
