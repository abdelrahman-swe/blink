// app/[lang]/layout.tsx
import LangWrapper from "./providers/LangWrapper";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <LangWrapper lang={lang}>{children}</LangWrapper>;
}
