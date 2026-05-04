"use client";
import { useLogin } from "@/hooks/queries/useAuthQueries";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginPayload } from "@/utils/types/auth";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Locale } from "@/lib/dictionaries";
import { getLoginSchema, checkIsEmail } from "@/utils/schema/authSchema";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from '@hugeicons/react';
import { FloatingInput } from "@/components/ui/FloatingInput";
import AppLink from '@/components/common/AppLink';
import { useDictionary } from "@/components/providers/DictionaryProvider";

type LoginFormProps = {
    lang: Locale;
};

type LoginSchema = ReturnType<typeof getLoginSchema>;
type LoginFormValues = z.infer<LoginSchema>;

export default function LoginForm({ lang }: LoginFormProps) {
    const { auth: t } = useDictionary();
    const { mutate: login, isPending } = useLogin();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "";
    const schema = useMemo<LoginSchema>(() => getLoginSchema(), []);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            identifier: "",
            password: "",
            rememberMe: false,
        },
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const rememberedPhoneOrEmail = localStorage.getItem("rememberPhoneOrEmail");
        const rememberedPassword = localStorage.getItem("rememberPassword");
        if (rememberedPhoneOrEmail) {
            form.setValue("identifier", rememberedPhoneOrEmail);
            form.setValue("password", rememberedPassword || "");
            form.setValue("rememberMe", true);
        }
    }, [form]);

    const onSubmit = (data: LoginFormValues) => {
        form.clearErrors("root");
        const { rememberMe, identifier, ...rest } = data;
        const isEmailLike = checkIsEmail(identifier);

        const loginData: LoginPayload = {
            password: data.password,
            rememberMe: data.rememberMe,
            identifier: data.identifier
        };

        login(loginData as any, {
            onSuccess: () => {
                if (data.rememberMe) {
                    localStorage.setItem("rememberPhoneOrEmail", data.identifier);
                    localStorage.setItem("rememberPassword", data.password);
                } else {
                    localStorage.removeItem("rememberPhoneOrEmail");
                    localStorage.removeItem("rememberPassword");
                }
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || "Login failed";
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    Object.keys(errors).forEach((key) => {
                        if (key === 'phone' || key === 'email' || key === 'password' || key === 'identifier') {
                            const fieldKey = (key === 'phone' || key === 'email') ? 'identifier' : key as any;
                            form.setError(fieldKey, { message: errors[key] });
                        }
                    });
                } else {
                    form.setError("root", { message });
                }
            }
        });
    };

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5 w-full ">
                <h1 className="text-3xl font-medium mb-10">{t.login.title}</h1>

                {/* Phone Number or Email */}
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => {
                        const isEmailLike = field.value && checkIsEmail(field.value);
                        return (
                            <FormItem>
                                <FormControl>
                                    <FloatingInput
                                        {...field}
                                        label={t.login.phoneOrEmail}
                                        type="text"
                                        inputMode={isEmailLike ? "email" : "tel"}
                                        placeholder={t.login.phoneOrEmailPlaceholder}
                                        aria-invalid={!!form.formState.errors.identifier}
                                        autoComplete="username"
                                    />
                                </FormControl>
                                {form.formState.errors.identifier && (
                                    <p className="text-destructive text-sm mt-1">
                                        {
                                            t.validation[
                                            form.formState.errors.identifier
                                                ?.message as keyof typeof t.validation
                                            ] || form.formState.errors.identifier?.message
                                        }
                                    </p>
                                )}
                            </FormItem>
                        )
                    }}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.login.password}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t.login.passwordPlaceholder}
                                    {...field}
                                    aria-invalid={!!form.formState.errors.password}
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


                            {form.formState.errors.password && (
                                <p className="text-destructive text-sm">
                                    {
                                        t.validation[
                                        form.formState.errors.password
                                            .message as keyof typeof t.validation
                                        ] || form.formState.errors.password?.message
                                    }
                                </p>
                            )}


                            {/* GENERAL ERROR */}
                            {form.formState.errors.root && (
                                <p className="text-destructive text-sm font-medium mb-3">
                                    {
                                        t.validation[
                                        form.formState.errors.root.message as keyof typeof t.validation
                                        ] || form.formState.errors.root.message
                                    }
                                </p>
                            )}



                            {/* Remember me + Forgot password */}
                            <div className="flex items-center justify-between mt-3">
                                <FormField
                                    control={form.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-md text-primary">
                                                {t.login.rememberMe}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <AppLink
                                    href={`/${lang}/forget-password`}
                                    className="text-primary font-medium text-md"
                                >
                                    {t.login.forgotPassword}
                                </AppLink>
                            </div>
                        </FormItem>

                    )}
                />


                <div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? t.login.signingIn : t.login.signInButton}
                    </Button>

                    <div className="text-center text-md text-primary mt-4">
                        {t.login.noAccount}
                        <AppLink
                            href={`/${lang}/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                            className="text-primary text-md font-medium hover:underline mx-2"
                        >
                            {t.login.signUpLink}
                        </AppLink>
                    </div>
                </div>
            </form>
        </Form>


    );
}