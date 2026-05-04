import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/lib/dictionaries';
import { cookies } from 'next/headers';
import AppLink from '@/components/common/AppLink';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default async function NotFound() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = localeCookie && locales.includes(localeCookie as any)
    ? localeCookie
    : defaultLocale;

  return (

    <div className="bg-[#f9f9f9] text-primary min-h-screen flex items-center justify-center px-5">

      <div className="text-center">
        <h2 className="text-primary text-7xl font-bold ">404</h2>
        <p className="text-primary text-2xl my-8">
          Sorry! We couldn’t find this page.
        </p>

        <AppLink href={`/${locale}/home`} passHref>
          <Button
            size="icon-sm"
            aria-label="Take Me Home"
            className="group w-50 py-6 text-md bg-primary hover:bg-primary/80 text-background font-medium">
            Take Me Home
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={23}
              color="currentColor"
              strokeWidth={2}
              className='group-hover:translate-x-1 transition-all'
            />
          </Button>
        </AppLink>
      </div>
    </div >
  );
}
