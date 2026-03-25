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
          className="flex-shrink-0 flex items-center justify-between px-5 h-13 border-b"
          style={{ background: '#ffffff', borderColor: '#E2E8F0', height: '52px' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold text-white"
              style={{ background: '#00297A' }}
            >
              ✦
            </div>
            <span className="text-sm font-bold" style={{ color: '#00297A' }}>
              O4AA Knowledge Hub
            </span>
            <span className="text-xs" style={{ color: '#64748B' }}>
              Okta for AI Agents
            </span>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full border"
            style={{ background: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E40AF' }}
          >
            SE Internal Reference
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
