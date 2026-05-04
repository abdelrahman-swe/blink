'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../ui/tooltip';


import {
    UserCircleIcon,
    LogoutCircle01Icon,
    AddToListIcon,
    TruckReturnIcon,
    AccountSetting02Icon,
    FavouriteIcon,
    ShoppingBasket03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useLogout } from '@/hooks/queries/useUserQueries';
import AppLink from '../common/AppLink';
import { useState } from 'react';
import { useDictionary } from '../providers/DictionaryProvider';
import { useParams } from 'next/navigation';
import { Separator } from '../ui/separator';
import { UseGetCartProductQuery } from '@/hooks/queries/useCartQueries';


const AuthorizedUser = ({ locale, user }: { locale: string; user: any }) => {

    const [userPopoverOpen, setUserPopoverOpen] = useState(false);
    const { home } = useDictionary();
    const navbar = home?.navbar;
    const params = useParams();
    const lang = (params?.lang as string) || locale;
    const { mutate: logout, isPending } = useLogout();
    const { data: cartItems = [] } = UseGetCartProductQuery();
    const cartItemsCount = cartItems.length;

    return (
        <>
            <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <button className="outline-none cursor-pointer">
                                <HugeiconsIcon icon={UserCircleIcon} size={26} />
                            </button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{user?.full_name?.split(' ').slice(0, 2).join(' ')}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="py-1 w-48 mt-3 border-none shadow-md">

                    <AppLink
                        href={`/${lang}/profile/account`}
                        onClick={() => setUserPopoverOpen(false)}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-md hover:bg-gray-100 transition-colors"
                    >
                        <HugeiconsIcon icon={UserCircleIcon} size={22} color='#999999' />
                        {navbar.profileText}
                    </AppLink>

                    <AppLink
                        href={`/${lang}/profile/orders`}
                        onClick={() => setUserPopoverOpen(false)}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-md hover:bg-gray-100 transition-colors"
                    >
                        <HugeiconsIcon icon={AddToListIcon} size={22} color='#999999' />
                        {navbar.myOrders}
                    </AppLink>

                    <AppLink
                        href={`/${lang}/profile/returns`}
                        onClick={() => setUserPopoverOpen(false)}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-md hover:bg-gray-100 transition-colors"
                    >
                        <HugeiconsIcon icon={TruckReturnIcon} size={22} color='#999999' />
                        {navbar.returns}
                    </AppLink>

                    <AppLink
                        href={`/${lang}/profile/security-settings`}
                        onClick={() => setUserPopoverOpen(false)}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-md hover:bg-gray-100 transition-colors"
                    >
                        <HugeiconsIcon icon={AccountSetting02Icon} size={22} color='#999999' />
                        {navbar.settings}
                    </AppLink>

                    <Separator />
                    <AppLink
                        href={`/${lang}/login`}

                        onClick={() => {
                            setUserPopoverOpen(false);
                            logout();
                        }}
                        className="w-full flex items-center gap-2 p-3 rtl:px-3 hover:bg-red-50 text-md font-normal text-red-500 hover:text-red-500"
                    >
                        <HugeiconsIcon
                            icon={LogoutCircle01Icon}
                            size={20}
                            color='#E80000'
                            className="rotate-270" />
                        {isPending ? navbar.loggingText : navbar.logoutText}
                    </AppLink>
                </PopoverContent>
            </Popover>

            <AppLink href={`/${lang}/profile/favourite`}>
                <HugeiconsIcon icon={FavouriteIcon} size={26} />
            </AppLink>
            <AppLink href={`/${lang}/cart`} className="relative">
                <HugeiconsIcon icon={ShoppingBasket03Icon} size={26} />
                {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                    </span>
                )}
            </AppLink>
        </>
    )
}

export default AuthorizedUser