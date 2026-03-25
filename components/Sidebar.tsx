'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_GROUPS } from '@/lib/sections';
import NewBadge from './NewBadge';

export default function Sidebar() {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith('/section/')
    ? pathname.split('/section/')[1]
    : '';

  return (
    <aside
      className="flex-shrink-0 overflow-y-auto"
      style={{
        width: '240px',
        background: '#ffffff',
        borderRight: '1px solid #E2E8F0',
      }}
    >
      <div className="py-3">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.groupLabel}>
            {gi > 0 && (
              <div className="mx-4 my-1.5" style={{ height: '1px', background: '#F1F5F9' }} />
            )}
            <div className="px-3 pt-3 pb-1">
              <p
                className="text-[10px] font-bold uppercase px-2 mb-2"
                style={{
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                  fontFamily: "'JetBrains Mono', 'DM Sans', monospace",
                }}
              >
                {group.groupLabel}
              </p>
              {group.items.map(item => {
                const isActive = item.slug === activeSlug;
                return (
                  <Link
                    key={item.slug}
                    href={`/section/${item.slug}`}
                    className="flex items-center gap-2.5 rounded-lg mb-0.5 transition-all duration-150"
                    style={{
                      padding: '7px 10px',
                      background: isActive ? '#EFF6FF' : 'transparent',
                      borderLeft: isActive ? '2.5px solid #00297A' : '2.5px solid transparent',
                      paddingLeft: isActive ? '8px' : '10px',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span className="text-[15px] w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span
                      className="text-[12.5px] leading-tight"
                      style={{
                        color: isActive ? '#00297A' : '#475569',
                        fontWeight: isActive ? 600 : 450,
                      }}
                    >
                      {item.label}
                    </span>
                    {item.isNew && <NewBadge />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
