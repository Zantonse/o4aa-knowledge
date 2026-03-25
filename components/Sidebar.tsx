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
      style={{ width: '220px', background: '#ffffff', borderRight: '1px solid #E2E8F0' }}
    >
      {NAV_GROUPS.map((group, gi) => (
        <div key={group.groupLabel}>
          {gi > 0 && (
            <div className="mx-3" style={{ height: '1px', background: '#E2E8F0' }} />
          )}
          <div className="px-3 pt-3 pb-1">
            <p
              className="text-[9px] font-bold uppercase tracking-widest px-1 mb-1"
              style={{ color: '#00297A' }}
            >
              {group.groupLabel}
            </p>
            {group.items.map(item => {
              const isActive = item.slug === activeSlug;
              return (
                <Link
                  key={item.slug}
                  href={`/section/${item.slug}`}
                  className="flex items-center gap-2 rounded-md mb-0.5 transition-colors duration-100"
                  style={{
                    padding: isActive ? '6px 8px 6px 6px' : '6px 8px',
                    background: isActive ? '#EFF6FF' : 'transparent',
                    borderLeft: isActive ? '2px solid #00297A' : '2px solid transparent',
                  }}
                >
                  <span className="text-sm w-5 text-center">{item.icon}</span>
                  <span
                    className="text-[11px]"
                    style={{
                      color: isActive ? '#00297A' : '#475569',
                      fontWeight: isActive ? 700 : 500,
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
    </aside>
  );
}
