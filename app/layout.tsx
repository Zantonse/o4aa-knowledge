import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AiBar from '@/components/AiBar';

export const metadata: Metadata = {
  title: 'O4AA Knowledge Hub',
  description: 'Okta for AI Agents — SE Internal Reference',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col">
        <header
          className="flex-shrink-0 flex items-center justify-between px-5 border-b"
          style={{ background: '#ffffff', borderColor: '#E2E8F0', height: '54px' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #00297A, #0041B8)',
                boxShadow: '0 1px 4px rgba(0,41,122,0.25)',
              }}
            >
              ✦
            </div>
            <div className="flex items-baseline gap-0">
              <span
                className="text-[15px] font-bold"
                style={{ color: '#00297A', letterSpacing: '-0.01em' }}
              >
                O4AA Knowledge Hub
              </span>
              <span
                className="text-[13px] font-light mx-2.5"
                style={{ color: '#CBD5E1' }}
              >
                |
              </span>
              <span
                className="text-[12px] font-medium"
                style={{ color: '#94A3B8' }}
              >
                Okta for AI Agents
              </span>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold px-3 py-1 rounded-md border"
            style={{
              background: '#F8FAFC',
              borderColor: '#E2E8F0',
              color: '#64748B',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.04em',
            }}
          >
            SE INTERNAL
          </span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main
            className="flex-1 overflow-y-auto"
            style={{ background: '#F8FAFC', paddingBottom: '80px' }}
          >
            {children}
          </main>
        </div>

        <AiBar />
      </body>
    </html>
  );
}
