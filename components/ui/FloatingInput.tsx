"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FloatingInputProps extends React.ComponentProps<"input"> {
    label: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ label, className, startContent, endContent, type = "text", ...props }, ref) => {
        return (
            <div className="relative w-full group">
                <Input
                    type={type}
                    ref={ref}
                    className={cn(
                        "h-12 rtl:text-right",
                        startContent ? "pl-24 rtl:pl-3 rtl:pr-24" : "",
                        endContent ? "pr-10 rtl:pr-3 rtl:pl-10" : "",
                        className
                    )}
                    {...props}
                />

                <Label
                    className={cn(
                        "absolute -top-3 start-3 bg-white px-2 font-medium text-sm z-10 transition-all",
                        props["aria-invalid"] ? "text-destructive" : "text-foreground group-focus-within:text-primary"
                    )}
                >
                    {label}
                </Label>

                {startContent && (
                    <div className="absolute start-3 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
                        {startContent}
                    </div>
                )}

                {endContent && (
                    <div className="absolute end-3 top-1/2 -translate-y-1/2 z-20 flex items-center">
                        {endContent}
                    </div>
                )}
            </div>
        );
    }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
