
"use client";

import { Heart } from "lucide-react";
import {
    AccountSetting02Icon,
    AddToListIcon,
    LogoutCircle02Icon,
    UserCircleIcon,
    ArrowRight02Icon,
    TruckReturnIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/hooks/queries/useUserQueries";
import AppLink from '@/components/common/AppLink';
import { usePathname } from "next/navigation";
import { Locale } from "@/utils/types/locale";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface ProfileSidebarProps {
    lang: Locale;
    dict: any;
    onClose?: () => void;
}

export function ProfileSidebar({ lang, dict, onClose }: ProfileSidebarProps) {
    const { mutate: logout, isPending: logoutPending } = useLogout();
    const [signOutDialog, setSignOutDialog] = useState(false);
    const pathname = usePathname();

    const handleItemClick = () => {
        if (onClose) onClose();
    };

    const t = dict?.profile;

    return (
        <aside className="w-full bg-background rounded-xl p-3">
            <nav className="flex flex-col gap-2">

                <SidebarItem
                    href={`/${lang}/profile/account`}
                    icon={<HugeiconsIcon icon={UserCircleIcon} size={22} />}
                    active={pathname === `/${lang}/profile/account`}
                    onClick={handleItemClick}
                >
                    {t?.sidebar?.myAccount}
                </SidebarItem>

                <SidebarItem
                    href={`/${lang}/profile/favourite`}
                    icon={<Heart className="size-5" />}
                    active={pathname === `/${lang}/profile/favourite`}
                    onClick={handleItemClick}
                >
                    {t?.sidebar?.wishlist}
                </SidebarItem>

                <SidebarItem
                    href={`/${lang}/profile/orders`}
                    icon={<HugeiconsIcon icon={AddToListIcon} size={22} />}
                    active={pathname === `/${lang}/profile/orders`}
                    onClick={handleItemClick}
                >
                    {t?.sidebar?.orders}
                </SidebarItem>

                <SidebarItem
                    href={`/${lang}/profile/returns`}
                    icon={<HugeiconsIcon icon={TruckReturnIcon} size={22} />}
                    active={pathname === `/${lang}/profile/returns`}
                    onClick={handleItemClick}
                >
                    {t?.sidebar?.returns}
                </SidebarItem>

                <SidebarItem
                    href={`/${lang}/profile/security-settings`}
                    icon={<HugeiconsIcon icon={AccountSetting02Icon} size={22} />}
                    active={pathname === `/${lang}/profile/security-settings`}
                    onClick={handleItemClick}
                >
                    {t?.sidebar?.securitySettings}
                </SidebarItem>

                <Separator />

                {/* LOGOUT */}
                <SidebarItem
                    isLogout
                    onClick={() => {
                        setSignOutDialog(true);
                    }}
                    icon={
                        <HugeiconsIcon
                            icon={LogoutCircle02Icon}
                            size={22}
                            className="rotate-270"
                        />
                    }
                    className="text-red-600 hover:bg-red-50 cursor-pointer"
                >
                    {t?.sidebar?.logout}
                </SidebarItem>
            </nav>

            <Dialog open={signOutDialog} onOpenChange={setSignOutDialog}>
                <DialogContent className="sm:max-w-lg space-y-3 p-8">
                    <DialogTitle className="font-medium text-xl text-center mt-5">
                        {t?.logoutDialog?.title}
                    </DialogTitle>
                    <DialogFooter className="mx-auto text-center space-x-2">
                        <Button
                            variant="outline"
                            className="text-md rounded-3xl w-full sm:w-[45%]"
                            onClick={() => setSignOutDialog(false)}
                        >
                            {t?.logoutDialog?.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            className="text-md rounded-3xl w-full sm:w-[45%]"
                            onClick={() => {
                                setSignOutDialog(false);
                                handleItemClick();
                                logout();
                            }}
                            disabled={logoutPending}
                        >
                            {logoutPending ? t?.logoutDialog?.loggingOut : t?.logoutDialog?.confirm}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
}

/* ===== Reusable Item ===== */
function SidebarItem({
    icon,
    children,
    className = "",
    onClick,
    disabled,
    href,
    active = false,
    isLogout = false,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    href?: string;
    active?: boolean;
    isLogout?: boolean;
}) {
    const content = isLogout ? (
        /* Logout layout (centered) */
        <div className="flex items-center gap-2 justify-center">
            {icon}
            <span>{children}</span>
        </div>
    ) : (
        /* Normal item layout */
        <>
            {icon}
            <span className="flex-1">{children}</span>

            {active && (
                <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={20}
                    strokeWidth={1.5}
                    className="rtl:rotate-180"
                />
            )}
        </>
    );

    const commonClasses = `
        flex items-center px-3 py-3 me-3 rounded-lg font-medium transition-all
        hover:bg-muted
        disabled:opacity-50 disabled:pointer-events-none
        ${active ? "bg-gray-200 translate-x-[5px]" : ""}
        ${isLogout ? "justify-center" : "gap-3"}
        ${className}
    `;

    if (href) {
        return (
            <AppLink href={href} className={commonClasses} onClick={onClick}>
                {content}
            </AppLink>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={commonClasses}
        >
            {content}
        </button>
    );
}