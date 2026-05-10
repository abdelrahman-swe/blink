'use client';

import Image from 'next/image';
import AppLink from '@/components/common/AppLink';
import { HugeiconsIcon } from '@hugeicons/react';
import { footerImages, socialIcons, footerSocialIcons } from '@/helper';
import { Button } from '../ui/button';
import { useUserStore } from '@/store/useUserStore';
import { useDictionary } from '../providers/DictionaryProvider';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale: lang }: FooterProps) {
  const { footer: footerDict } = useDictionary();
  const { footer } = footerDict || {};
  const { brand, quickLinks, shopWithUs, customerServices, needHelp, copyright, privacyPolicy, termsConditions, returnRefund, ConnectWithUs } = footer || {};
  const { isAuthenticated } = useUserStore();

  const handleLinkClick = (e: React.MouseEvent, src: string) => {
    if (src === '/profile/favorites' && !isAuthenticated) {
      e.preventDefault();
    }
  };
  
  console.log(footerSocialIcons)

  return (
    <footer className="bg-secondary text-foreground pt-8" role="contentinfo">
      <div className="xl:container mx-auto w-full px-5">

        <div className="flex flex-col justify-center items-center">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 w-full">
            <div className="col-span-1 md:col-span-12 lg:col-span-4">
              <div className="flex flex-col justify-center items-center md:justify-start lg:items-start">
                <AppLink href="/" aria-label="Go to homepage">
                  <Image
                    src="/logo-icon-only.svg"
                    alt="Logo"
                    width={120}
                    height={100}
                    priority
                    className="mb-4"
                  />
                </AppLink>
                <p className="max-w-sm text-center lg:text-left rtl:lg:text-right">
                  {brand.description}
                </p>

              </div>
            </div>

            <div className="col-span-1 md:col-span-12 lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 text-center md:text-left  ">
                {[quickLinks, shopWithUs, customerServices, needHelp].map((section) => (
                  <div key={section.title} className="flex flex-col rtl:text-right">
                    <h2 className="font-medium text-lg">{section.title}</h2>
                    <ul className="mt-3">
                      {section.items.map((item: { label: string; src: string }) => (
                        <li key={item.label} className="my-2 text-sm  text-center md:text-left rtl:text-right">
                          <AppLink
                            href={`/${lang}${item.src}`}
                            className="hover:text-primary transition-colors hover:underline block "
                            onClick={(e) => handleLinkClick(e, item.src)}
                            prefetch={false}
                          >
                            {item.label}
                          </AppLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:grid grid-cols-12 gap-10 mt-5">
          <div className="col-span-12 md:col-span-6 lg:col-span-5 gap-5">
            <div className="w-full flex justify-center md:justify-start">
              <div className="w-fit flex flex-col items-center">
                <h3 className="font-semibold text-lg mb-2 text-center">{ConnectWithUs.description}</h3>
                <div className="mt-4 flex flex-wrap justify-center gap-5 rtl:gap-8">
                {footerSocialIcons.map(({ icon, alt }) => (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    type="button"
                    key={alt}
                    className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-xs hover:bg-gray-100"
                    aria-label={`Follow us on ${alt}`}
                  >
                    <Image src= {icon} alt={alt} width={26} height={26} />
                  </Button>
                ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <h3 className="font-semibold text-lg text-center mb-5">{shopWithUs.title}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {footerImages.map(({ src, alt }) => (
                <Image
                  key={src}
                  src={src}
                  alt={alt}
                  width={120}
                  height={40}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>


      </div>
      <div className="bg-black text-white mt-12 border-t border-black/10 px-5 flex justify-between gap-8 items-center py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 text-xs md:text-sm container mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <p className="text-center font-medium md:text-left text-base">{copyright.description}</p>
            <span className='text-gray-500 font-medium mt-1 '>v 1.0.6</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <AppLink className='uppercase font-normal md:font-medium text-sm md:text-md' href={`/${lang}/privacy-policy`}>{privacyPolicy.description}</AppLink>
            <AppLink className='uppercase font-normal md:font-medium text-sm md:text-md' href={`/${lang}/terms-conditions`}>{termsConditions.description}</AppLink>
            <AppLink className='uppercase font-normal md:font-medium text-sm md:text-md' href={`/${lang}/return-policy`}>{returnRefund.description}</AppLink>
          </div>
        </div>
      </div>

    </footer>
  );
}
