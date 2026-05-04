import { redirect } from 'next/navigation';
import { Locale } from '@/lib/dictionaries';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function RootPage({ params }: PageProps) {
  const { lang } = await params;

  redirect(`/${lang}/home`);

}
