'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CONTENT_MAP } from '@/lib/content/index';
import { SLUG_MAP } from '@/lib/sections';

export default function AiBar() {
  const pathname = usePathname();
  const slug = pathname.startsWith('/section/') ? pathname.split('/section/')[1] : '';
  const navItem = SLUG_MAP[slug];
  const sectionContent = CONTENT_MAP[slug];

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [devDocs, setDevDocs] = useState(true);
  const [helpDocs, setHelpDocs] = useState(true);
  const responseRef = useRef<HTMLDivElement>(null);

  // Clear response when section changes
  useEffect(() => { setResponse(''); }, [slug]);

  // Auto-scroll response panel
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || streaming) return;

    const q = question.trim();
    setQuestion('');
    setResponse('');
    setStreaming(true);

    const sectionContext = sectionContent
      ? sectionContent.cards
          .map(c => `${c.heading}\n${c.paragraphs.join('\n')}`)
          .join('\n\n')
      : '';

    const sources: string[] = [];
    if (devDocs) sources.push('dev-docs');
    if (helpDocs) sources.push('help-docs');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, sectionSlug: slug, sectionContent: sectionContext, sources }),
      });

      if (!res.ok) {
        setResponse(`Error: ${await res.text()}`);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setResponse(prev => prev + decoder.decode(value, { stream: true }));
        }
      } catch (e) {
        setResponse(e instanceof Error ? `Error: ${e.message}` : 'Request failed');
      } finally {
        reader.cancel().catch(() => {});
      }
    } catch (e) {
      setResponse(e instanceof Error ? `Error: ${e.message}` : 'Request failed');
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div
      className="fixed bottom-0 z-50 flex flex-col"
      style={{
        left: '220px',
        right: 0,
        background: '#F8FAFC',
        borderTop: '1.5px solid #E2E8F0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
      }}
    >
      {/* Streaming response panel */}
      {response && (
        <div
          ref={responseRef}
          className="px-6 py-3 text-sm leading-relaxed overflow-y-auto"
          style={{
            maxHeight: '200px',
            color: '#44403c',
            borderBottom: '1px solid #BFDBFE',
            background: '#F0F9FF',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#1E40AF' }}>
              Answer
            </span>
            <button onClick={() => setResponse('')} className="text-[10px]" style={{ color: '#1E40AF' }}>
              Dismiss ✕
            </button>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {response}
            {streaming && <span className="animate-pulse">▋</span>}
          </p>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-6 py-2.5">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-sm">✦</span>
          <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: '#334155' }}>
            Ask about{' '}
            <span style={{ color: '#00297A' }}>{navItem?.label ?? 'the docs'}</span>
          </span>
        </div>

        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={`e.g. How does ${navItem?.label ?? 'this'} work?`}
          className="flex-1 h-8 rounded-md px-3 text-xs outline-none"
          style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#0F172A' }}
          disabled={streaming}
        />

        {/* Source toggles */}
        {[
          { key: 'dev', label: 'dev docs', active: devDocs, toggle: () => setDevDocs(v => !v) },
          { key: 'help', label: 'help docs', active: helpDocs, toggle: () => setHelpDocs(v => !v) },
        ].map(({ key, label, active, toggle }) => (
          <button
            key={key}
            type="button"
            onClick={toggle}
            className="text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0"
            style={{
              background: active ? '#EFF6FF' : '#F1F5F9',
              borderColor: active ? '#BFDBFE' : '#E2E8F0',
              color: active ? '#1E40AF' : '#94A3B8',
              opacity: active ? 1 : 0.6,
            }}
          >
            {label}
          </button>
        ))}

        <button
          type="submit"
          disabled={!question.trim() || streaming}
          className="h-8 px-4 rounded-md text-xs font-bold disabled:opacity-40 flex-shrink-0"
          style={{ background: '#00297A', color: '#fff' }}
        >
          {streaming ? '…' : 'Ask'}
        </button>
      </form>
    </div>
  );
}
