"use client";

import { Delete02Icon, LogoutCircle02Icon, SquareLock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from "react";
import { Locale } from "@/utils/types/locale";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import DeleteAccountDialog from "./components/DeleteAccountDialog";
import SignOutDialog from "./components/SignOutDialog";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface SecuritySettingsContentProps {
    lang: Locale;
    authDict: any;
}

const SecuritySettingsContent = ({ lang, authDict }: SecuritySettingsContentProps) => {
    const { user: userDict } = useDictionary();
    const t = userDict?.profile?.securitySettings;

    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
    const [signOutDialog, setSignOutDialog] = useState(false);

    return (
        <section className="xl:container mx-auto">
            <div className="bg-background flex items-center gap-5 p-5 rounded-2xl border border-gray-300 mb-8">
                <HugeiconsIcon
                    icon={SquareLock01Icon}
                    size={26}
                    color="currentColor"
                    strokeWidth={1.4}
                />
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{t?.passwordSettings}</h3>
                    <p
                        className="text-sm underline cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setChangePasswordDialog(true)}
                    >
                        {t?.changePassword}
                    </p>
                </div>
            </div>

            {/* <div className="bg-background flex items-center gap-5 p-5 rounded-2xl border border-gray-300 mb-8">
                <HugeiconsIcon
                    icon={LogoutCircle02Icon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.4}
                    className="rotate-270"
                />
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{t?.signOutDevices}</h3>
                    <p
                        className="text-destructive text-sm underline cursor-pointer hover:text-destructive/80 transition-colors"
                        onClick={() => setSignOutDialog(true)}
                    >
                        {t?.signOut}
                    </p>
                </div>
            </div> */}

            <div className="bg-background flex items-center gap-5 p-5 rounded-2xl border border-gray-300 mb-8">
                <HugeiconsIcon
                    icon={Delete02Icon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.5}
                />
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{t?.deleteAccount}</h3>
                    <p
                        className="text-destructive text-sm underline cursor-pointer hover:text-destructive/80 transition-colors"
                        onClick={() => setDeleteAccountDialog(true)}
                    >
                        {t?.deleteAccount}
                    </p>
                </div>
            </div>

            <ChangePasswordDialog
                changePasswordDialog={changePasswordDialog}
                setChangePasswordDialog={setChangePasswordDialog}
                authDict={authDict}
                userDict={userDict}
                lang={lang}
            />
            <DeleteAccountDialog
                deleteAccountDialog={deleteAccountDialog}
                setDeleteAccountDialog={setDeleteAccountDialog}
                authDict={authDict}
                userDict={userDict}
                lang={lang} />

            {/* <SignOutDialog
                signOutDialog={signOutDialog}
                setSignOutDialog={setSignOutDialog}
                userDict={userDict}
            /> */}
        </section>
    );
};

export default SecuritySettingsContent;
