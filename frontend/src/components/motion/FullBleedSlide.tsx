'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import SmartImage from '@/components/SmartImage';

interface FullBleedSlideProps {
  imageSrc?: string | null;
  imageAlt: string;
  eyebrow?: string;
  heading: ReactNode;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  height?: 'full' | 'tall' | 'half';
  align?: 'left' | 'center' | 'right';
  priority?: boolean;
  children?: ReactNode;
}

const HEIGHT_CLASS: Record<NonNullable<FullBleedSlideProps['height']>, string> = {
  full: 'min-h-screen',
  tall: 'min-h-[85vh]',
  half: 'min-h-[55vh]',
};

export default function FullBleedSlide({
  imageSrc,
  imageAlt,
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  height = 'tall',
  align = 'center',
  priority = false,
  children,
}: FullBleedSlideProps) {
  return (
    <section className={`relative flex ${HEIGHT_CLASS[height]} w-full items-center overflow-hidden bg-neutral-900`}>
      {imageSrc ? (
        <>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <SmartImage src={imageSrc} alt={imageAlt} fill priority={priority} sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-black/55" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-dark to-neutral-900" />
      )}

      <div
        className={`relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 sm:py-28 ${
          align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={
            align === 'center' ? 'mx-auto max-w-3xl' : align === 'right' ? 'ml-auto max-w-2xl' : 'max-w-2xl'
          }
        >
          {eyebrow && (
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
          >
            {heading}
          </h1>
          {subheading && (
            <p
              className="mt-4 text-base text-white/90 sm:text-lg"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
            >
              {subheading}
            </p>
          )}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
            >
              {ctaLabel}
            </Link>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
