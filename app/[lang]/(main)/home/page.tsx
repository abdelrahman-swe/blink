import Brand from "@/components/home/Brand";
import Explore from "@/components/home/Explore";
import Hero from "@/components/home/Hero";
import Pros from "@/components/home/Pros";
import { getDictionary, Locale } from "@/lib/dictionaries";
import Image from "next/image";
import NewArrivals from "@/components/home/NewArrivals";
import BestSelling from "@/components/home/BestSelling";
import Deals from "@/components/home/Deals";


interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  return (
    <>
      <Hero />
      <Pros />
      <Deals />
      <NewArrivals />
      <Hero sortOrder={1} />
      <BestSelling />
      <Brand />
      <Explore />

    </>
  );
}
