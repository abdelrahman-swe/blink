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

export default async function HomePage({ params }: HomePageProps) {
  const banners = await getBanner().catch(() => []);

  return (
    <>
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
