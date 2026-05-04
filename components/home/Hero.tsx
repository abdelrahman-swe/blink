'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay, A11y, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { SwiperOptions } from 'swiper/types';
import { getBannerQuery } from '@/hooks/queries/useHomeQueries';
import AppLink from '@/components/common/AppLink';
import { Skeleton } from '../ui/skeleton';


import { useParams } from 'next/navigation';

export default function Hero({ sortOrder }: { sortOrder?: number }) {
  const { data: banners, isLoading ,error} = getBannerQuery();
  const params = useParams();
  const lang = params.lang as string;

  const filteredBanners = sortOrder
    ? banners?.filter(banner => banner.sort_order === sortOrder)
    : banners;

  const swiperParams: SwiperOptions = {
    modules: [Navigation, Pagination, Autoplay, A11y],
    spaceBetween: 0,
    slidesPerView: 1,
    autoplay: { delay: 3000, disableOnInteraction: false },
    // pagination: { clickable: true },
    loop: (filteredBanners?.length || 0) > 1,
    navigation: true,
  };
  if (isLoading) return <Skeleton className="w-full h-[400px]" />;
  if (!filteredBanners || filteredBanners.length === 0) return null;
 
  return (
    <section>
      <Swiper
        {...swiperParams}
        className="w-full "
        navigation={{
          nextEl: '.brand-swiper-button-next',
          prevEl: '.brand-swiper-button-prev',
        }}
      >
        {filteredBanners.map((banner) => (
          <SwiperSlide key={banner.id} className={`relative w-full ${(filteredBanners?.length || 0) > 1 ? "mb-8 md:mb-10!" : ""}`}>
            <AppLink href={`/${lang}/${banner.section}/${banner.slug}`} className="block w-full">
              <div className="relative w-full aspect-18/8 sm:aspect-21/9 lg:aspect-21/7">
              {banner.images?.original && (
                <Image
                  src={banner.images.original}
                  alt={`Banner ${banner.id}`}
                  fill
                  className="w-full h-full object-cover object-center"
                  priority={true}
                  loading="eager"
                />
              )}
              </div>
            </AppLink>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}
