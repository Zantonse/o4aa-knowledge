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
      <body className="h-full flex flex-col">
        <header
          className="flex-shrink-0 flex items-center justify-between px-5 h-12 border-b"
          style={{ background: '#fff7ed', borderColor: '#e8d5b0' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              ✦
            </div>
            <span className="text-sm font-bold" style={{ color: '#78350f' }}>
              O4AA Knowledge Hub
            </span>
            <span className="text-xs" style={{ color: '#a16207' }}>
              Okta for AI Agents
            </span>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full border"
            style={{ background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}
          >
            SE Internal Reference
          </span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main
            className="flex-1 overflow-y-auto"
            style={{ background: '#faf7f2', paddingBottom: '80px' }}
          >
            {children}
          </main>
        </div>

        <AiBar />
      </body>
    </html>
  );
}
