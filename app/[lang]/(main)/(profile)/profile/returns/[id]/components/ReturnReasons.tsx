"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/components/providers/DictionaryProvider";

import { useUserReturnReasons } from "@/hooks/queries/useUserQueries";

interface ReturnReasonsProps {
    form: UseFormReturn<any>;
}

export const ReturnReasons: React.FC<ReturnReasonsProps> = ({ form }) => {
    const { returns } = useDictionary();
    const { data: returnReasons, isLoading } = useUserReturnReasons();
    const returnReason = form.watch("reason");

    if (isLoading) {
        return (
            <div className="space-y-4 py-5">
                <h1 className="text-lg font-medium">{returns?.reasons?.selectReasons}</h1>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-start space-x-2">
                            <div className="h-4 w-30 animate-pulse rounded-md bg-muted" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-medium my-5">{returns?.reasons?.selectReasons}</h1>
            <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="w-fit space-y-1"
                            >
                                {returnReasons?.map((reason) => (
                                    <div key={reason.key} className="flex rtl:flex-row-reverse items-center gap-3">
                                        <RadioGroupItem value={reason.key} id={reason.key} />
                                        <Label className="font-normal cursor-pointer" htmlFor={reason.key}>
                                            {reason.label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        {form.formState.errors.reason && (
                            <p className="text-destructive text-[0.8rem] font-medium mt-2">
                                {returns?.validation?.[form.formState.errors.reason.message as keyof typeof returns.validation] || form.formState.errors.reason.message}
                            </p>
                        )}
                    </FormItem>
                )}
            />

            {returnReason === "other" && (
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder={returns?.reasons?.descriptionPlaceholder}
                                    className="min-h-[140px] mt-5 break-all p-3 resize-none shadow-none"
                                    {...field}
                                />
                            </FormControl>
                            {form.formState.errors.description && (
                                <p className="text-destructive text-[0.8rem] font-medium mt-2">
                                    {returns?.validation?.[form.formState.errors.description.message as keyof typeof returns.validation] || form.formState.errors.description.message}
                                </p>
                            )}
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};
