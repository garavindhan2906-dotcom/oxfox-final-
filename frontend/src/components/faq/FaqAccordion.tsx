'use client';

import { useState } from 'react';
import type { FaqItem } from '@/types';

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-neutral-900"
            >
              {item.question}
              <span className="ml-4 text-neutral-400">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
