"use client";import { useAppRouter } from '@/hooks/useAppRouter';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { useResetPassword } from '@/hooks/queries/useAuthQueries';
import { Locale } from '@/lib/dictionaries';
import { getResetPasswordSchema } from '@/utils/schema/authSchema';
import { ResetPasswordPayload } from '@/utils/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from 'react';
import { useDictionary } from "@/components/providers/DictionaryProvider";

type ResetPasswordProps = {
    lang: Locale;
};

type ResetPasswordSchema = ReturnType<typeof getResetPasswordSchema>;
type ResetPasswordValues = z.infer<ResetPasswordSchema>;

export default function ResetPasswordForm({ lang }: ResetPasswordProps) {
    const { auth: t } = useDictionary();
    const { mutate: resetPassword, isPending } = useResetPassword();
    const schema = getResetPasswordSchema();
    const router = useAppRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            new_password: "",
            new_password_confirmation: "",
        },
    });

    const onSubmit = (data: ResetPasswordValues) => {
        const identifier = sessionStorage.getItem("forget-password-identifier");
        if (!identifier) {
            toast.error("Account identifier not found. Please start over.");
            router.push(`/${lang}/forget-password`);
            return;
        }

        const payload: ResetPasswordPayload = {
            new_password: data.new_password,
            new_password_confirmation: data.new_password_confirmation,
            identifier: identifier,
        };

        resetPassword(payload, {
            onError: (error: any) => {
                const message = error.response?.data?.message || "Password reset failed";
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    Object.keys(errors).forEach((key) => {
                        if (key === 'new_password' || key === 'new_password_confirmation' || key === 'identifier') {
                            form.setError(key, { message: errors[key] });
                        }
                    });
                } else {
                    form.setError("new_password", { message });
                }
            },
            onSuccess: () => {
                localStorage.removeItem("otp-resend-limiter-forget-password");
                if (identifier) {
                    localStorage.removeItem(`otp-resend-limiter-forget-password-${identifier}`);
                }
                sessionStorage.removeItem("forget-password-identifier");
                Cookies.remove("forget-password-otp");
                router.push(`/${lang}/successfully-changed`);
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5 w-full">
                <div className="text-center">
                    <h1 className="text-3xl font-medium">{t.resetPassword.title}</h1>
                    <p className="text-md mt-3">{t.resetPassword.subtitle}</p>
                </div>


                {/* Password */}
                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.resetPassword.newPassword}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t.resetPassword.newPasswordPlaceholder}
                                    {...field}
                                    aria-invalid={!!form.formState.errors.new_password}
                                    endContent={
                                        <Button
                                            size="icon-lg"
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="text-muted-foreground focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <HugeiconsIcon
                                                    icon={ViewIcon}
                                                    size={20}
                                                    color="#000000"
                                                    strokeWidth={1.5}
                                                />
                                            ) : (
                                                <HugeiconsIcon
                                                    icon={ViewOffSlashIcon}
                                                    size={20}
                                                    color="#000000"
                                                    strokeWidth={1.5}
                                                />
                                            )}
                                        </Button>
                                    }
                                />
                            </FormControl>
                            {form.formState.errors.new_password && (
                                <p className="text-destructive text-sm">
                                    {t.validation[form.formState.errors.new_password?.message as keyof typeof t.validation] || form.formState.errors.new_password?.message}
                                </p>
                            )}
                        </FormItem>
                    )}
                />


                {/*Confirm Password */}
                <FormField
                    control={form.control}
                    name="new_password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.resetPassword.confirmPassword}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder={t.resetPassword.confirmPasswordPlaceholder}
                                    {...field}
                                    aria-invalid={!!form.formState.errors.new_password}
                                    endContent={
                                        <Button
                                            size="icon-lg"
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="text-muted-foreground focus:outline-none"
                                        >
                                            {showConfirmPassword ? (
                                                <HugeiconsIcon
                                                    icon={ViewIcon}
                                                    size={20}
                                                    color="#000000"
                                                    strokeWidth={1.5}
                                                />
                                            ) : (
                                                <HugeiconsIcon
                                                    icon={ViewOffSlashIcon}
                                                    size={20}
                                                    color="#000000"
                                                    strokeWidth={1.5}
                                                />
                                            )}
                                        </Button>
                                    }
                                />
                            </FormControl>
                            {form.formState.errors.new_password_confirmation && (
                                <p className="text-destructive text-sm">
                                    {t.validation[form.formState.errors.new_password_confirmation?.message as keyof typeof t.validation] || form.formState.errors.new_password_confirmation?.message}
                                </p>
                            )}
                        </FormItem>
                    )}
                />


                <div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? t.resetPassword.resetting : t.resetPassword.resetButton}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
