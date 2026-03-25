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
      className="rounded-xl p-5 mb-4"
      style={{ background: '#F8FAFC', border: '1.5px dashed #CBD5E1' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-[11px] font-bold uppercase tracking-wide"
          style={{ color: '#00297A' }}
        >
          Architecture Diagram
        </h3>
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="text-[11px] font-semibold px-3 py-1 rounded-md disabled:opacity-50"
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1E40AF',
          }}
        >
          {loading ? 'Generating…' : 'Regenerate ✦'}
        </button>
      </div>
      {error && (
        <p className="text-xs mb-2" style={{ color: '#b91c1c' }}>{error}</p>
      )}
      {imgMissing ? (
        <div
          className="w-full rounded-lg flex items-center justify-center text-xs italic"
          style={{ minHeight: '120px', background: '#F1F5F9', color: '#64748B' }}
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
  );
}
