'use client';
import AppLink from '../common/AppLink'
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ShoppingBasket03Icon,
    UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { UseGetCartProductQuery } from '@/hooks/queries/useCartQueries';
import { Button } from '../ui/button';
import { useDictionary } from '../providers/DictionaryProvider';
import { useParams } from 'next/navigation';

const NotAuthorizedUser = ({locale}: {locale: string}) => {
    const { data: cartItems = [] } = UseGetCartProductQuery();
    const cartItemsCount = cartItems.length;
    const params = useParams();
    const { home } = useDictionary();
    const navbar = home?.navbar;
    const lang = (params?.lang as string) || locale;

    return (
        <>
            <AppLink href={`/${lang}/cart`} className="relative">
                <HugeiconsIcon icon={ShoppingBasket03Icon} size={25} />
                {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                    </span>
                )}
            </AppLink>

            <hr className="h-8 w-0.5 bg-gray-300" />

            <AppLink href={`/${lang}/login`} className="flex gap-2">
                <HugeiconsIcon icon={UserCircleIcon} size={25} />
                {navbar.loginText}
            </AppLink>

            <Button className='rounded-4xl px-5'>
                <AppLink href={`/${lang}/register`}>
                    {navbar.signUpText}
                </AppLink>
            </Button>
        </>
    )
}

export default NotAuthorizedUser