import Image, { type ImageProps } from 'next/image';

const isExternalUrl = (src: string) => /^https?:\/\//i.test(src);

/** Wraps next/image, bypassing the optimizer for externally pasted URLs (which aren't in remotePatterns). */
export default function SmartImage({ alt, src, unoptimized, ...rest }: ImageProps) {
  const external = typeof src === 'string' && isExternalUrl(src);
  return <Image {...rest} src={src} alt={alt} unoptimized={external || unoptimized} />;
}
