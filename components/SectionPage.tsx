import type { SectionContent } from '@/lib/types';
import ContentCard from './ContentCard';
import DiagramCard from './DiagramCard';
import NewBadge from './NewBadge';
import { SLUG_MAP } from '@/lib/sections';

export default function SectionPage({ content }: { content: SectionContent }) {
  const navItem = SLUG_MAP[content.slug];

  return (
    <div className="px-10 py-8 max-w-[720px]">
      {/* Section header */}
      <div className="flex items-start gap-5 mb-8">
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
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1
              className="text-[22px] font-bold tracking-tight"
              style={{ color: '#0F172A', letterSpacing: '-0.02em' }}
            >
              {content.title}
            </h1>
            {navItem?.isNew && <NewBadge />}
          </div>
          <p
            className="text-[14.5px] leading-relaxed mb-3"
            style={{ color: '#64748B', lineHeight: 1.6 }}
          >
            {content.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {content.tags.map(tag => (
              <span
                key={tag}
                className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full border"
                style={{
                  background: '#EFF6FF',
                  borderColor: '#DBEAFE',
                  color: '#1E40AF',
                  letterSpacing: '0.01em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6" style={{ height: '1px', background: '#E2E8F0' }} />

      {/* Content cards with numbering */}
      {content.cards.map((card, i) => (
        <div key={i}>
          <ContentCard card={card} index={i} />
          {content.hasDiagram && i === 0 && <DiagramCard section={content} />}
        </div>
      ))}
    </div>
  );
}
