'use client';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useState, useEffect, useRef } from 'react';
import AppLink from '@/components/common/AppLink';
import Image from 'next/image';
import {
  useSearchParams,
  usePathname,
  useParams
} from 'next/navigation';
import { Locale } from '@/lib/dictionaries';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  AiSearch02Icon,
  FavouriteIcon,
  ShoppingBasket03Icon,
  UserCircleIcon,
  Menu01Icon,
  Home12Icon,
  Logout05Icon,
  Cancel01Icon,
  CancelSquareIcon,
} from '@hugeicons/core-free-icons';

import { useUserStore } from '@/store/useUserStore';
import { useLoadingStore } from '@/store/useLoadingStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import LanguageSwitcher from '../settings/LanguageSwitcher';
import { ButtonGroup } from '../ui/button-group';
import { getSearchSuggestionQuery } from '@/hooks/queries/useSearchQueries';
import { UseGetCartProductQuery } from '@/hooks/queries/useCartQueries';
import { useLogout } from '@/hooks/queries/useUserQueries';
import { useTokenRefresh } from '@/hooks/queries/useAuthQueries';
import { Separator } from '../ui/separator';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { DesktopNavBarSkeleton, MobileNavBarSkeleton } from '../skeleton/NavBarSkeleton';
import { useDictionary } from '../providers/DictionaryProvider';
import AuthorizedUser from '../auth/AuthorizedUser';
import NotAuthorizedUser from '../auth/NotAuthorizedUser';

type NavBarProps = {
  locale: Locale;
  initialIsAuthenticated?: boolean;
};

export const NavBar = ({ locale, initialIsAuthenticated = false }: NavBarProps) => {
  const { home } = useDictionary();
  const { startLoading } = useLoadingStore();
  const navbar = home?.navbar;
  const router = useAppRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params?.lang as string) || locale;

  const { mutate: logout, isPending } = useLogout();
  const { isAuthenticated, syncWithCookies, user } = useUserStore();

  useTokenRefresh();

  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldShowDropdownRef = useRef(true);

  const searchQuery = getSearchSuggestionQuery(query, { enabled: false });
  const { refetch, data: suggestions, isFetching } = searchQuery;
  const suggestionsData = suggestions?.data;

  const { data: cartItems = [] } = UseGetCartProductQuery();
  const cartItemsCount = cartItems.length;

  useEffect(() => {
    syncWithCookies();
    setIsMounted(true);
  }, [syncWithCookies]);

  useEffect(() => {
    if (!query) {
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }

    const t = setTimeout(() => {
      if (shouldShowDropdownRef.current) {
        refetch();
        setShowDropdown(true);
        setSelectedIndex(-1);
      }
      shouldShowDropdownRef.current = true; // Reset for next interaction
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: any) => {
      if (!e.target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (pathname.includes('search-result')) {
      const urlQuery = searchParams.get('query');
      if (urlQuery !== null) {
        shouldShowDropdownRef.current = false;
        setQuery(urlQuery);
      }
    } else {
      setQuery('');
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  }, [pathname, searchParams]);

  const renderSearchComponent = (isMobile = false) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestionsData || suggestionsData.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestionsData.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0) {
          e.preventDefault();
          const selectedItem = suggestionsData[selectedIndex];
          shouldShowDropdownRef.current = false;
          setQuery(selectedItem);
          setShowDropdown(false);
          if (isMobile) setOpen(false);
          router.push(
            `/${locale}/search-result?query=${encodeURIComponent(selectedItem)}`
          );
        }
      }
    };

    const handleSearch = () => {
      setShowDropdown(false);
      if (isMobile) setOpen(false);
      router.push(
        `/${locale}/search-result?query=${encodeURIComponent(query.trim())}`
      );
    };

    return (
      <div
        className={`relative search-container ${isMobile ? 'mb-5' : 'flex-1'
          }`}
      >
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <ButtonGroup className="w-full">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={AiSearch02Icon}
                size={24}
                className="absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3"
                color='gray'
                strokeWidth={1.5}
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => {
                  shouldShowDropdownRef.current = true;
                  setQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder={navbar.search}
                className="h-10 pl-10 rtl:pl-5 rtl:pr-10 rounded-r-none rtl:rounded-l-none rtl:rounded-r-md border-gray-300 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    if (pathname.includes('search-result')) {
                      router.push(`/${locale}/search-result?query=`);
                    }
                  }}
                  className="absolute right-3 top-1/2 rtl:left-3! rtl:right-auto! -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </button>
              )}
            </div>
            <Button type="submit">
              {navbar.searchButton}
            </Button>
          </ButtonGroup>
        </form>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute w-full mt-2 bg-white shadow-lg rounded-lg border z-50 max-h-60 overflow-y-auto"
          >
            {isFetching && (
              <p className="p-3 text-sm text-gray-500">Loading...</p>
            )}
            {!isFetching &&
              suggestionsData?.map((item: string, idx: number) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 text-sm md:text-md ${idx === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                  onClick={() => {
                    shouldShowDropdownRef.current = false;
                    setQuery(item);
                    setShowDropdown(false);
                    if (isMobile) setOpen(false);
                    router.push(
                      `/${locale}/search-result?query=${encodeURIComponent(
                        item
                      )}`
                    );
                  }}
                >
                  {item}
                </Button>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-secondary w-full shadow-sm sticky top-0 z-50 pe-3 md:px-5">
      <nav className="xl:container mx-auto flex items-center justify-between h-16 md:h-20 gap-4">
        {/* Logo */}
        <div className="flex items-center ">
          <AppLink href={`/${locale}/home`}>
            <Image
              src="/logo-icon-only.svg"
              alt="Logo"
              width={100}
              height={70}
              className="relative rtl:ms-5"
              priority
            />
          </AppLink>

          <div className="hidden md:block ms-4 rtl:ms-0">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>

        {/* Search (desktop) */}
        <div className="hidden sm:flex flex-1 ">
          {renderSearchComponent(false)}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-5">
          {!isMounted ? (
            <DesktopNavBarSkeleton isAuthenticated={initialIsAuthenticated} />
          ) : !isAuthenticated ? (
            <>
              <NotAuthorizedUser locale={locale} />
            </>
          ) : (
            <>
              <AuthorizedUser locale={locale} user={user} />
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={(e) => {
              e.currentTarget.blur();
              setOpen(true);
            }}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent className="overflow-y-auto h-full" aria-describedby={undefined}>
          <DrawerHeader className="flex flex-row justify-between items-center border-b pb-4">
            <DrawerTitle>
              <Image
                src="/logo-icon-only.svg"
                alt="Logo"
                width={100}
                height={70}
                priority
              />
            </DrawerTitle>
            <DrawerClose asChild className=''>
              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon
                  icon={CancelSquareIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="p-2 space-y-5 mt-3 mx-2">
            {renderSearchComponent(true)}

            <div className="flex flex-col justify-start gap-8 py-5 ">
              <AppLink href={`/${lang}/home`} onClick={() => setOpen(false)} className=' flex items-center gap-4'>
                <HugeiconsIcon
                  icon={Home12Icon}
                  size={24}
                />
                {navbar.homeText}
              </AppLink>
              <AppLink href={`/${lang}/cart`} onClick={() => setOpen(false)} className='flex items-center gap-4 relative'>
                <HugeiconsIcon icon={ShoppingBasket03Icon} size={24} />
                <span>{navbar.cartText}</span>
                {cartItemsCount > 0 && (
                  <span className="ml-auto rtl:ml-4 rtl:mr-auto bg-primary text-primary-foreground text-xs font-semibold rounded-full h-6 w-6 text-center flex  items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </AppLink>

              {!isMounted ? (
                <MobileNavBarSkeleton isAuthenticated={initialIsAuthenticated} />
              ) : isAuthenticated ? (
                <>
                  <AppLink href={`/${lang}/profile/account`} onClick={() => setOpen(false)} className=' flex items-center gap-4'>
                    <HugeiconsIcon icon={UserCircleIcon} size={24} />
                    {navbar.profileText}
                  </AppLink>
                  <AppLink
                    href={`/${lang}/profile/favourite`}
                    onClick={() => setOpen(false)} className=' flex items-center gap-4'
                  >
                    <HugeiconsIcon icon={FavouriteIcon} size={24} />
                    {navbar.favouritesText}
                  </AppLink>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setUserPopoverOpen(false);
                      startLoading();
                      logout();
                    }}
                    className="flex justify-start items-start gap-4 text-md w-full hover:bg-red-50 text-md text-red-600 ms-1!"
                  >
                    <HugeiconsIcon
                      icon={Logout05Icon}
                      size={22}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    {isPending ? navbar.loggingText : navbar.logoutText}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col justify-center gap-5">
                  <Button
                    className='rounded-4xl px-5 w-full'
                    variant="outline"
                    size="icon-sm"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/${lang}/login`);
                    }}
                  >
                    <div className="flex gap-2">
                      <HugeiconsIcon icon={UserCircleIcon} size={20} />
                      {navbar.loginText}
                    </div>
                  </Button>
                  <Button
                    className='rounded-4xl px-5 w-full'
                    onClick={() => {
                      setOpen(false);
                      router.push(`/${lang}/register`);
                    }}
                  >
                    {navbar.signUpText}
                  </Button>
                </div>
              )}


            </div>

            <Separator />
            <div className="">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header >
  );
};

export default NavBar;
