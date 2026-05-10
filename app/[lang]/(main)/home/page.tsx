import type { Metadata } from "next";
import { PUBLIC_API } from "@/lib/config";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Brand from "@/components/home/Brand";
import Explore from "@/components/home/Explore";
import Hero from "@/components/home/Hero";
import Pros from "@/components/home/Pros";
import { getDictionary, Locale } from "@/lib/dictionaries";
import Image from "next/image";
import NewArrivals from "@/components/home/NewArrivals";
import BestSelling from "@/components/home/BestSelling";
import Deals from "@/components/home/Deals";


import { getBanner } from "@/utils/services/home";

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

async function getHomepageSeo(lang: string) {
    try {
        const res = await fetch(`${PUBLIC_API}/seo/homepage`, {
            headers: { "X-Locale": lang },
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { lang } = await params;
    const seoData = await getHomepageSeo(lang);

    return generateSeoMetadata(seoData, lang, {
        title: "Blink",
        description: "Where things are blinking"
    });
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const banners = await getBanner().catch(() => []);
  const seoData = await getHomepageSeo(lang);

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
