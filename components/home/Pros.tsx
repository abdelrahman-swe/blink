'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShippingTruck01Icon,
  CreditCardIcon,
  HeadphonesIcon,
  Task01Icon,
} from '@hugeicons/core-free-icons';


interface ProItem {
  icon: keyof typeof iconMap;
  title: string;
  desc: string;
}



const iconMap = {
  ShippingTruck01Icon,
  CreditCardIcon,
  HeadphonesIcon,
  Task01Icon,
} as const;

import { useDictionary } from '../providers/DictionaryProvider';

interface ProsProps { }

export default function Pros({ }: ProsProps) {
  const { home } = useDictionary();
  const pros = home?.pros || [];
  return (
    <section className="xl:container mx-auto mt-3 px-5 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {pros.map((pro: ProItem) => {
          const IconComponent = iconMap[pro.icon];

          return (
            <article className="flex items-start gap-6" key={pro.title}>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <span
                  className="absolute top-6 left-5 w-12 h-12 bg-secondary rounded-full z-0"
                  aria-hidden="true"
                ></span>

                <HugeiconsIcon
                  icon={IconComponent}
                  size={60}
                  color="#000000"
                  strokeWidth={1}
                  className="relative z-10"
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col justify-start items-start">
                <h3 className="text-lg font-medium text-foreground">
                  {pro.title}
                </h3>
                <p className="text-md text-muted-foreground font-medium">{pro.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
