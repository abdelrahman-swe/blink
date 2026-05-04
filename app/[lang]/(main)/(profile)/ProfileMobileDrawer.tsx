"use client";

import { useState } from "react";
import { Menu01Icon, CancelSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ProfileSidebar } from "./ProfileSideBar";
import { Locale } from "@/utils/types/locale";

interface ProfileMobileDrawerProps {
    lang: Locale;
    dict: any;
}

export function ProfileMobileDrawer({ lang, dict }: ProfileMobileDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => setOpen(true)}
                className="hover:bg-gray-100 h-10 w-10 "
            >
                <HugeiconsIcon
                    icon={Menu01Icon}
                    size={23}
                    strokeWidth={1.5}
                    color="currentColor"
                />
            </Button>

            <Drawer open={open} onOpenChange={setOpen} direction="bottom">
                <DrawerContent className="max-h-screen">
                    <DrawerHeader className="flex flex-row justify-between items-center border-b pb-4">
                        <DrawerTitle className="text-lg font-semibold ms-3">{dict?.profile?.drawer?.title}</DrawerTitle>
                        <DrawerClose asChild>
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
                    <div className="overflow-y-auto ">
                        <ProfileSidebar
                            lang={lang}
                            dict={dict}
                            onClose={() => setOpen(false)}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
