'use client';

import { useState } from 'react';
import type { SectionContent } from '@/lib/types';

export default function DiagramCard({ section }: { section: SectionContent }) {
  const [imgSrc, setImgSrc] = useState(`/diagrams/${section.slug}.png`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgMissing, setImgMissing] = useState(false);

  async function handleRegenerate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: section.slug }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as { imageDataUrl: string };
      setImgSrc(data.imageDataUrl);
      setImgMissing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-xl mb-5 overflow-hidden"
      style={{
        background: '#FAFCFF',
        border: '1.5px dashed #CBD5E1',
      }}
    >
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #F1F5F9' }}
      >
        <div className="flex items-center gap-2.5">
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
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="text-[11px] font-semibold px-3.5 py-1.5 rounded-lg disabled:opacity-50 transition-all"
          style={{
            background: '#EFF6FF',
            border: '1px solid #DBEAFE',
            color: '#1E40AF',
          }}
        >
          {loading ? 'Generating…' : 'Regenerate ✦'}
        </button>
      </div>
      <div className="p-4">
        {error && (
          <p className="text-xs mb-2 px-2" style={{ color: '#b91c1c' }}>{error}</p>
        )}
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
            No diagram yet — click Regenerate ✦ to generate one
          </div>
        ) : (
          // next/image not used: src can be a base64 data URL after regeneration
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
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
