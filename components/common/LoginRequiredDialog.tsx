'use client';

import { useAppRouter } from '@/hooks/useAppRouter';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";

interface LoginRequiredDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message?: string;
}

export const LoginRequiredDialog = ({
    open,
    onOpenChange,
    message
}: LoginRequiredDialogProps) => {
    const router = useAppRouter();
    const params = useParams();
    const lang = params.lang as string;
    const pathname = usePathname();
    const { home } = useDictionary();
    const { startLoading } = useLoadingStore();
    const loginDict = home?.loginRequiredDialog;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg space-y-2">
                <DialogTitle className="font-medium text-xl">
                    {loginDict?.title || "Login Required"}
                </DialogTitle>
                <DialogDescription className="text-md">
                    <span className="text-[#0D0D0D] whitespace-normal">
                        {message || loginDict?.message || "Need to Login to be able to continue."}
                    </span>
                </DialogDescription>
                <DialogFooter className="mx-auto text-center space-x-2 w-full">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="text-md rounded-3xl w-full sm:w-[45%]"
                    >
                        {loginDict?.cancel || "Cancel"}
                    </Button>
                    <Button
                        onClick={() => {
                            onOpenChange(false);
                            startLoading();
                            router.push(`/${lang}/login?callbackUrl=${encodeURIComponent(pathname)}`);
                        }}
                        className="text-md rounded-3xl w-full sm:w-[45%]"
                    >
                        {loginDict?.login || "Login"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
