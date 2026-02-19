import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  widths?: number[];
  onClick?: () => void;
}

function buildUnsplashSrcSet(baseUrl: string, widths: number[]): string {
  return widths
    .map((w) => {
      const url = baseUrl.replace(/&w=\d+/, `&w=${w}`).replace(/&q=\d+/, '&q=75');
      // Request WebP format from Unsplash
      const webpUrl = url.includes('&fm=') ? url.replace(/&fm=\w+/, '&fm=webp') : `${url}&fm=webp`;
      return `${webpUrl} ${w}w`;
    })
    .join(', ');
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  widths = [400, 600, 800, 1200],
  onClick,
}) => {
  const isUnsplash = src.includes('unsplash.com');

  if (!isUnsplash) {
    return <img src={src} alt={alt} className={className} loading={loading} onClick={onClick} />;
  }

  const srcSet = buildUnsplashSrcSet(src, widths);
  // WebP version as primary src
  const webpSrc = src.includes('&fm=') ? src.replace(/&fm=\w+/, '&fm=webp') : `${src}&fm=webp`;

  return (
    <picture>
      <source srcSet={srcSet} sizes={sizes} type="image/webp" />
      <img
        src={webpSrc}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        onClick={onClick}
      />
    </picture>
  );
};

export default OptimizedImage;
