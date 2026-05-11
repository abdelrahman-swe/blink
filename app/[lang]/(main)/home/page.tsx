import type { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Brand from "@/components/home/Brand";
import Explore from "@/components/home/Explore";
import Hero from "@/components/home/Hero";
import Pros from "@/components/home/Pros";
import NewArrivals from "@/components/home/NewArrivals";
import BestSelling from "@/components/home/BestSelling";
import Deals from "@/components/home/Deals";

import { getBanner } from "@/utils/services/home";

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { lang } = await params;
    const seoData = await getStaticPageSeo("homepage", lang);

    return generateSeoMetadata(seoData, lang, {
        title: "Blink",
        description: "Where things are blinking"
    });
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const banners = await getBanner().catch(() => []);
  const seoData = await getStaticPageSeo("homepage", lang);

  return (
    <>
      <JsonLd data={seoData?.jsonLd} />
      <Hero initialBanners={banners} />
      <Pros />
      <Deals />
      <NewArrivals />
      <Hero sortOrder={1} initialBanners={banners} />
      <BestSelling />
      <Brand />
      <Explore />

    </>
  );
}
