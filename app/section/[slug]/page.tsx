import { notFound } from 'next/navigation';
import { CONTENT_MAP } from '@/lib/content/index';
import SectionPage from '@/components/SectionPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SectionRoute({ params }: Props) {
  const { slug } = await params;
  const content = CONTENT_MAP[slug];
  if (!content) notFound();
  return <SectionPage content={content} />;
}

export function generateStaticParams() {
  return Object.keys(CONTENT_MAP).map(slug => ({ slug }));
}
