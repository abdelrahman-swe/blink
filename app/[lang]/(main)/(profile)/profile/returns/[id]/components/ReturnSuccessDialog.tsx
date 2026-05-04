"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface ReturnSuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ReturnSuccessDialog: React.FC<ReturnSuccessDialogProps> = ({
    open,
    onOpenChange
}) => {
    const { returns } = useDictionary();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="space-y-8 py-10 max-h-70">
                <DialogHeader>
                    <DialogTitle className="mx-auto my-3">
                        <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={70}
                            color="#34C759"
                            strokeWidth={1.5}
                        />
                    </DialogTitle>
                    <DialogDescription className="text-xl text-primary font-medium mx-auto text-center max-w-xs">
                        {returns?.success?.submittedMessage}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
