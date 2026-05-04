"use client"; import { useAppRouter } from '@/hooks/useAppRouter';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForgetPassword } from '@/hooks/queries/useAuthQueries';
import { useOtpResendLimiter } from '@/hooks/useOtpResendLimiter';
import { Locale } from '@/lib/dictionaries';
import { getForgotPasswordSchema, checkIsEmail } from '@/utils/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import Image from 'next/image';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useDictionary } from "@/components/providers/DictionaryProvider";

type ForgetPasswordProps = {
    lang: Locale;
};
type ForgetPasswordSchema = ReturnType<typeof getForgotPasswordSchema>;
type ForgetPasswordValues = z.infer<ForgetPasswordSchema>;

export default function ForgetPasswordForm({ lang }: ForgetPasswordProps) {
    const { auth: t } = useDictionary();
    const { mutate: forgetPassword, isPending } = useForgetPassword();
    const schema = getForgotPasswordSchema();
    const router = useAppRouter();

    const { triggerBlock } = useOtpResendLimiter("forget-password", 3);
    const form = useForm<ForgetPasswordValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            identifier: "",
        },
    });

    useEffect(() => {
        const savedIdentifier = sessionStorage.getItem("forget-password-identifier");
        if (savedIdentifier) {
            form.setValue("identifier", savedIdentifier);
        }
    }, [form]);

    // Save form data to sessionStorage whenever it changes
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.identifier) {
                sessionStorage.setItem("forget-password-identifier", value.identifier);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = (data: ForgetPasswordValues) => {
        forgetPassword(data, {
            onSuccess: (response) => {
                sessionStorage.setItem("forget-password-identifier", data.identifier);
                if (response.data?.otp) {
                    Cookies.set("forget-password-otp", response.data.otp.toString());
                }
                toast.success(t.forgotPassword.success);
                router.push(`/${lang}/verify-forget-account`);
            },
            onError: (error: any) => {
                if (error.response?.status === 429) {
                    const retryAfter = error.response?.data?.data?.retry_after || 15 * 60;
                    sessionStorage.setItem("forget-password-identifier", data.identifier);
                    triggerBlock(retryAfter, data.identifier);
                    router.push(`/${lang}/verify-forget-account`);
                    return;
                }

                const message = error.response?.data?.message || "send otp failed";
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    Object.keys(errors).forEach((key) => {
                        if (key === 'phone' || key === 'identifier' || key === 'email') {
                            form.setError('identifier', { message: errors[key] });
                        }
                    });
                } else {
                    form.setError("identifier", { message });
                }
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5 w-full">

                <div className="text-center">
                    <h1 className="text-3xl font-medium">{t.forgotPassword.title}</h1>
                    <p className="max-w-xs text-md mt-3 mx-auto ">{t.forgotPassword.subtitle}</p>
                </div>

                {/* Phone Number */}
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => {
                        const isEmailLike = field.value && checkIsEmail(field.value);
                        return (
                            <FormItem>
                                <FormControl>
                                    <FloatingInput
                                        label={t.login.phoneOrEmail}
                                        type="text"
                                        inputMode={isEmailLike ? "email" : "tel"}
                                        placeholder={t.login.phoneOrEmailPlaceholder}
                                        {...field}
                                        aria-invalid={!!form.formState.errors.identifier}
                                        autoComplete="username"
                                    />
                                </FormControl>
                                {form.formState.errors.identifier && (
                                    <p className="text-destructive text-sm">
                                        {
                                            t.validation[
                                            form.formState.errors.identifier
                                                ?.message as keyof typeof t.validation
                                            ] || form.formState.errors.identifier?.message
                                        }
                                    </p>
                                )}
                            </FormItem>
                        );
                    }}
                />

                <div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? t.forgotPassword.sending : t.forgotPassword.forgetButton}
                    </Button>
                </div>
            </form>
        </Form>
    )
}