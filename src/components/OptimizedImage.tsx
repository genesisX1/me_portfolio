import type { ImgHTMLAttributes, Ref } from 'react';
import imageManifest from '@/data/optimized-images.json';

const images: Record<string, { src: string; srcSet: string }> = imageManifest;

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  ref?: Ref<HTMLImageElement>;
};

/** Original PNG fallback preserves older-browser support and transparent edges. */
export default function OptimizedImage({ src, sizes = '100vw', ...props }: Props) {
  const optimized = images[src];
  if (!optimized) return <img src={src} sizes={sizes} {...props} />;

  return (
    <picture className="optimized-picture">
      <source type="image/webp" srcSet={optimized.srcSet} sizes={sizes} />
      <img src={src} sizes={sizes} {...props} />
    </picture>
  );
}
