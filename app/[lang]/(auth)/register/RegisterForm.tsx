"use client"; import { useAppRouter } from '@/hooks/useAppRouter';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/hooks/queries/useAuthQueries";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { RegisterPayload } from "@/utils/types/auth";
import { Locale } from "@/lib/dictionaries";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { getRegisterSchema } from "@/utils/schema/authSchema";
import { FloatingInput } from "@/components/ui/FloatingInput";
import AppLink from '@/components/common/AppLink';
import { Checkbox } from "@/components/ui/checkbox";


type RegisterFormProps = {
    lang: Locale;
};

export default function RegisterForm({ lang }: RegisterFormProps) {
    const { auth: t } = useDictionary();
    const schema = getRegisterSchema();
    const router = useAppRouter();
    const { mutate: register, isPending, isError, error } = useRegister();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
            terms: false,
        },
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem("register-form-data");
        if (savedData) {
            try {
                form.reset(JSON.parse(savedData));
            } catch (error) {
                sessionStorage.removeItem("register-form-data");
            }
        }
    }, [form]);

    // Save form data to sessionStorage whenever it changes
    useEffect(() => {
        const subscription = form.watch((value) => {
            sessionStorage.setItem("register-form-data", JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = (data: RegisterPayload) => {
        form.clearErrors("root");
        register(data, {
            onSuccess: (response) => {
                sessionStorage.setItem("register-form-data", JSON.stringify(data));
                Cookies.set("identifier", data.phone);
                if (response.data?.user?.otp) {
                    Cookies.set("otp", response.data.user.otp.toString());
                }
                toast.success(t.register.success || "Registration successful");
                const verifyUrl = `/${lang}/verify-register-account${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
                window.location.replace(verifyUrl);

            },
            onError: (error: any) => {
                const responseData = error.response?.data;
                const validationErrors = responseData?.errors || responseData?.data;
                const message = responseData?.message || "Registration failed";
                let hasSpecificError = false;

                if (validationErrors && typeof validationErrors === 'object') {
                    Object.keys(validationErrors).forEach((key) => {
                        const errMsg = Array.isArray(validationErrors[key]) ? validationErrors[key][0] : validationErrors[key];
                        if (['full_name', 'email', 'phone', 'password', 'password_confirmation', 'terms'].includes(key)) {
                            form.setError(key as any, { message: errMsg });
                            hasSpecificError = true;
                        }
                    });
                }

                if (!hasSpecificError) {
                    form.setError('root', { message });
                }
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h1 className="text-3xl font-medium my-10">{t.register.title}</h1>

                {/* Full Name */}
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.register.fullName}
                                    placeholder={t.register.fullNamePlaceholder}
                                    {...field}
                                />
                            </FormControl>
                            {form.formState.errors.full_name && (
                                <p className="text-destructive text-sm">
                                    {
                                        t.validation[
                                        form.formState.errors.full_name
                                            ?.message as keyof typeof t.validation
                                        ] || form.formState.errors.full_name?.message
                                    }
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.register.email}
                                    type="email"
                                    placeholder={t.register.emailPlaceholder}
                                    {...field}
                                />
                            </FormControl>
                            {form.formState.errors.email && (
                                <p className="text-destructive text-sm">
                                    {
                                        t.validation[
                                        form.formState.errors.email
                                            ?.message as keyof typeof t.validation
                                        ] || form.formState.errors.email?.message
                                    }
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.register.phoneNumber}
                                    type="tel"
                                    placeholder={t.register.phoneNumberPlaceholder}
                                    {...field}
                                    aria-invalid={!!form.formState.errors.phone}
                                    startContent={
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/EG.svg"
                                                alt="eg-flag"
                                                width={20}
                                                height={20}
                                            />
                                            <span className="text-sm font-medium text-foreground">+20</span>
                                            <div className="h-4 w-[2px] bg-gray-300 mx-1" />
                                        </div>
                                    }
                                />
                            </FormControl>
                            {form.formState.errors.phone && (
                                <p className="text-destructive text-sm">
                                    {
                                        t.validation[
                                        form.formState.errors.phone
                                            ?.message as keyof typeof t.validation
                                        ] || form.formState.errors.phone?.message
                                    }
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.register.password}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t.register.passwordPlaceholder}
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
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingInput
                                    label={t.register.confirmPassword}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder={t.register.confirmPasswordPlaceholder}
                                    {...field}
                                    aria-invalid={!!form.formState.errors.password_confirmation}
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
                            {form.formState.errors.password_confirmation && (
                                <p className="text-destructive text-sm">
                                    {
                                        t.validation[
                                        form.formState.errors.password_confirmation
                                            .message as keyof typeof t.validation
                                        ] || form.formState.errors.password_confirmation?.message
                                    }
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                {/* Terms and Conditions */}
                <div className="flex items-center justify-between mt-3">
                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row items-center gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-md text-primary">
                                        {t.register.agree}<AppLink className="underline" href={`/${lang}/terms-conditions`} target="_blank" rel="noopener noreferrer">{t.register.termsAndConditions}</AppLink>
                                    </FormLabel>
                                </div>
                                {form.formState.errors.terms && (
                                    <p className="text-destructive text-xs me-auto">
                                        {
                                            t.validation[
                                            form.formState.errors.terms
                                                ?.message as keyof typeof t.validation
                                            ] || form.formState.errors.terms?.message
                                        }
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />
                </div>


                <div>
                    {form.formState.errors.root && (
                        <p className="text-destructive text-sm font-medium mb-4">
                            {
                                t.validation[
                                form.formState.errors.root.message as keyof typeof t.validation
                                ] || form.formState.errors.root.message
                            }
                        </p>
                    )}
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending
                            ? t.register.signingUp
                            : t.register.signUpButton}
                    </Button>

                    <div className="text-center text-md text-primary mt-4">
                        {t.register.haveAccount}{" "}
                        <AppLink href={`/${lang}/login`} className="text-primary text-md font-medium hover:underline mx-2">
                            {t.register.signInLink}
                        </AppLink>
                    </div>
                </div>
            </form>
        </Form>
    );
}