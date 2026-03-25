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

  useEffect(() => { setResponse(''); }, [slug]);

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
      className={`fixed bottom-0 z-50 flex flex-col ${streaming ? 'stream-pulse' : ''}`}
      style={{
        left: '240px',
        right: 0,
        background: '#ffffff',
        borderTop: streaming ? '2px solid #BFDBFE' : '1px solid #E2E8F0',
        boxShadow: streaming ? '0 -4px 20px rgba(0,41,122,0.06)' : '0 -2px 12px rgba(0,0,0,0.03)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Streaming response panel */}
      {response && (
        <div
          ref={responseRef}
          className="overflow-y-auto"
          style={{
            maxHeight: '240px',
            borderBottom: '1px solid #E2E8F0',
            background: '#FAFCFF',
          }}
        >
          <div className="flex items-center justify-between px-6 pt-3 pb-1.5">
            <div className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #DBEAFE' }}
              >
                ✦
              </span>
              <span
                className="text-[10.5px] font-semibold uppercase"
                style={{ color: '#1E40AF', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}
              >
                Answer
              </span>
            </div>
            <button
              onClick={() => setResponse('')}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors"
              style={{ color: '#64748B', background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Dismiss ✕
            </button>
          </div>
          <div className="px-6 pb-4">
            <p
              className="text-[13.5px] leading-[1.7]"
              style={{ color: '#334155', whiteSpace: 'pre-wrap' }}
            >
              {response}
              {streaming && <span className="animate-pulse" style={{ color: '#00297A' }}>▋</span>}
            </p>
          </div>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="w-6 h-6 rounded-md flex items-center justify-center text-[11px]"
            style={{ background: '#00297A', color: '#fff' }}
          >
            ✦
          </span>
          <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: '#475569' }}>
            Ask about{' '}
            <span style={{ color: '#00297A', fontWeight: 600 }}>{navItem?.label ?? 'the docs'}</span>
          </span>
        </div>

        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={`e.g. How does ${navItem?.label ?? 'this'} work?`}
          className="flex-1 h-9 rounded-lg px-3.5 text-[13px] outline-none transition-all"
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
          }}
          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00297A'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(0,41,122,0.08)'; }}
          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          disabled={streaming}
        />

        {/* Source toggles */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[9px] font-medium mr-1" style={{ color: '#94A3B8' }}>Sources</span>
          {[
            { key: 'dev', label: 'developer.okta.com', short: 'Dev', active: devDocs, toggle: () => setDevDocs(v => !v) },
            { key: 'help', label: 'help.okta.com', short: 'Help', active: helpDocs, toggle: () => setHelpDocs(v => !v) },
          ].map(({ key, short, label, active, toggle }) => (
            <button
              key={key}
              type="button"
              onClick={toggle}
              title={active ? `Searching ${label} — click to disable` : `Click to search ${label}`}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all flex-shrink-0"
              style={{
                background: active ? '#EFF6FF' : 'transparent',
                borderColor: active ? '#BFDBFE' : '#E2E8F0',
                color: active ? '#1E40AF' : '#CBD5E1',
                textDecoration: active ? 'none' : 'line-through',
              }}
            >
              {short}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!question.trim() || streaming}
          className="h-9 px-5 rounded-lg text-[12.5px] font-semibold disabled:opacity-30 flex-shrink-0 transition-all"
          style={{ background: '#00297A', color: '#fff' }}
          onMouseEnter={e => { if (!streaming) (e.currentTarget as HTMLElement).style.background = '#001D5C'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#00297A'; }}
        >
          {streaming ? '…' : 'Ask'}
        </button>
      </form>
    </div>
  );
}
