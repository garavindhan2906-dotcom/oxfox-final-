'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('oxfox_intro_shown')) return;
    sessionStorage.setItem('oxfox_intro_shown', '1');
    setVisible(true);
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#FAF8F5]"
      style={{
        transition: 'opacity 0.6s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <Image
        src="/image.png"
        alt="OXFOX Studio"
        width={180}
        height={80}
        className="h-auto w-36 object-contain sm:w-44"
        priority
      />

      {/* Loading bar */}
      <div className="mt-8 h-0.5 w-24 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-[#3B2A1C]"
          style={{
            animation: 'oxfox-intro-bar 1.6s cubic-bezier(0.4,0,0.2,1) forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes oxfox-intro-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
