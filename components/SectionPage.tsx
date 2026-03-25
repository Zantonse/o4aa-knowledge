import type { SectionContent } from '@/lib/types';
import ContentCard from './ContentCard';
import DiagramCard from './DiagramCard';
import NewBadge from './NewBadge';
import { SLUG_MAP } from '@/lib/sections';

export default function SectionPage({ content }: { content: SectionContent }) {
  const navItem = SLUG_MAP[content.slug];

  return (
    <div className="px-10 py-8" style={{ maxWidth: '760px' }}>
      {/* Section header */}
      <div className="flex items-start gap-5 mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: '#EFF6FF',
            border: '1px solid #DBEAFE',
            boxShadow: '0 2px 8px rgba(0, 41, 122, 0.06)',
          }}
        >
          {content.icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2.5 mb-2">
            <h1
              className="text-[24px] font-bold"
              style={{ color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}
            >
              {content.title}
            </h1>
            {navItem?.isNew && <NewBadge />}
          </div>
          <p
            className="text-[14px] mb-3.5"
            style={{
              color: '#64748B',
              lineHeight: 1.7,
              maxWidth: '580px',
            }}
          >
            {content.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {content.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  background: '#F8FAFC',
                  borderColor: '#E2E8F0',
                  color: '#64748B',
                  letterSpacing: '0.02em',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider with section stats */}
      <div className="flex items-center gap-3 mb-7">
        <div className="flex-1" style={{ height: '1px', background: '#E2E8F0' }} />
        <span
          className="text-[10px] font-medium flex-shrink-0"
          style={{ color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}
        >
          {content.cards.length} sections{content.hasDiagram ? ' + diagram' : ''}
        </span>
        <div className="flex-1" style={{ height: '1px', background: '#E2E8F0' }} />
      </div>

      {/* Content cards with staggered entrance */}
      {content.cards.map((card, i) => (
        <div
          key={i}
          className="card-enter"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <ContentCard card={card} index={i} />
          {content.hasDiagram && i === 0 && (
            <div className="card-enter" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
              <DiagramCard section={content} />
            </div>
          )}
        </div>
      ))}

      {/* Bottom spacer */}
      <div style={{ height: '40px' }} />
    </div>
  );
}
