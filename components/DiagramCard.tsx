'use client';

import { useState } from 'react';
import type { SectionContent } from '@/lib/types';

export default function DiagramCard({ section }: { section: SectionContent }) {
  const [imgMissing, setImgMissing] = useState(false);

  return (
    <div
      className="rounded-xl mb-5 overflow-hidden"
      style={{
        background: '#FAFCFF',
        border: '1.5px dashed #CBD5E1',
      }}
    >
      <div
        className="px-6 py-3 flex items-center gap-2.5"
        style={{ borderBottom: '1px solid #F1F5F9' }}
      >
        <span
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px]"
          style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #DBEAFE' }}
        >
          ✦
        </span>
        <h3
          className="text-[12.5px] font-semibold uppercase tracking-wide"
          style={{ color: '#00297A', letterSpacing: '0.05em' }}
        >
          Architecture Diagram
        </h3>
      </div>
      <div className="p-4">
        {imgMissing ? (
          <div
            className="w-full rounded-lg flex items-center justify-center text-[13px]"
            style={{
              minHeight: '140px',
              background: '#F1F5F9',
              color: '#64748B',
              fontStyle: 'italic',
            }}
          >
            No diagram available
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/diagrams/${section.slug}.png`}
            alt={`${section.title} architecture diagram`}
            className="w-full rounded-lg"
            style={{ minHeight: '80px', background: '#F8FAFC' }}
            onError={() => setImgMissing(true)}
          />
        )}
      </div>
    </div>
  );
}
