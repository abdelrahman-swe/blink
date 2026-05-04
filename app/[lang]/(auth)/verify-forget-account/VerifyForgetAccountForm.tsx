"use client"; import { useAppRouter } from '@/hooks/useAppRouter';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { useForgetResendOtp, useResendOtp, useVerifyForgetPassword } from '@/hooks/queries/useAuthQueries';
import { useOtpResendLimiter } from '@/hooks/useOtpResendLimiter';
import { Locale } from '@/lib/dictionaries';
import { getVerifyAccountSchema } from '@/utils/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import AppLink from '@/components/common/AppLink';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useDictionary } from "@/components/providers/DictionaryProvider";

type VerifyForgetAccountProps = {
    lang: Locale;
};
type VerifyForgetAccountSchema = ReturnType<typeof getVerifyAccountSchema>;
type VerifyForgetAccountValues = z.infer<VerifyForgetAccountSchema>;

export default function VerifyForgetAccountForm({ lang }: VerifyForgetAccountProps) {
    const { auth: t } = useDictionary();
    const [identifier] = useState(() => sessionStorage.getItem("forget-password-identifier") || undefined);
    const router = useAppRouter();

    const { mutate: verifyForgetPasswordMutation, isPending, isSuccess } = useVerifyForgetPassword();
    const { mutate: forgetResendOtpMutation, isPending: isResendOtpPending } = useForgetResendOtp();
    const schema = useMemo(() => getVerifyAccountSchema(), []);

    const [otp, setOtp] = useState(Cookies.get("forget-password-otp"));

    useEffect(() => {
        if (!identifier && !isSuccess) {
            router.replace(`/${lang}/forget-password`);
        }
    }, [identifier, lang, router, isSuccess]);

    const {
        isBlocked,
        isCooldown,
        remainingSeconds,
        onResendSuccess,
        triggerBlock,
    } = useOtpResendLimiter("forget-password", 3, identifier);

    const form = useForm<VerifyForgetAccountValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            identifier: "",
            otp: "",
        },
    });

    const wasBlocked = useRef(isBlocked);

    useEffect(() => {
        if (wasBlocked.current && !isBlocked) {
            form.clearErrors("otp");
        }
        wasBlocked.current = isBlocked;
    }, [isBlocked, form]);

    const otpValue = form.watch("otp");
    const isSubmitDisabled = isPending || !otpValue || otpValue.length < 6;

    useEffect(() => {
        if (identifier) {
            form.setValue("identifier", identifier);
        }
        if (otp) {
            setTimeout(() => {
                toast.info(`${t.verifyCode.yourCodeIs || "Your verification code is"} ${otp}`);
            }, 100);
        }
    }, [identifier, otp, form, t]);


    const handleResendOtp = () => {
        if (!identifier || isBlocked || isCooldown) return;

        forgetResendOtpMutation(
            { identifier },
            {
                onSuccess: (data) => {
                    onResendSuccess();

                    if (data.data?.otp) {
                        const newOtp = data.data.otp.toString();
                        Cookies.set("forget-password-otp", newOtp);
                        setOtp(newOtp);
                    }
                },
                onError: (error: any) => {
                    if (error.response?.status === 429) {
                        const retryAfter = error.response?.data?.data?.retry_after;
                        triggerBlock(retryAfter, identifier);
                    }
                    const message = error.response?.data?.message || "Verification failed";
                    form.setError("otp", { message });
                }
            }
        );
    };

    const onSubmit = (data: VerifyForgetAccountValues) => {
        if (!identifier) {
            toast.error("Account identifier missing");
            return;
        }
        verifyForgetPasswordMutation({
            identifier: data.identifier,
            otp: data.otp,
        }, {
            onSuccess: () => {
                Cookies.remove("forget-password-otp");
                router.push(`/${lang}/reset-password`);
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || "Verification failed";
                form.setError("otp", { message });
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center gap-5">
                    <h1 className="text-3xl font-medium text-primary">{t.verifyCode.title}</h1>
                    <p className="text-primary text-center max-w-xs">
                        {t.verifyCode.subtitle}
                    </p>

                    <p className="text-primary text-center">{t.verifyCode.wrongPhoneOrEmail}
                        <AppLink className='text-primary font-medium' href={`/${lang}/forget-password`}> {t.verifyCode.edit}</AppLink>
                    </p>

                    {otp && <p className="text-green-800 font-medium">{t.verifyCode.yourCodeIs} {otp}</p>}
                </div>

                {/* OTP Input */}
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem className='mt-5 w-full'>
                            <FormControl >
                                <InputOTP
                                    containerClassName="w-full"
                                    maxLength={6}
                                    value={field.value || ""}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        if (value.length === 6) {
                                            form.setValue("otp", value);
                                            form.handleSubmit(onSubmit)();
                                        }
                                    }}
                                >
                                    <InputOTPGroup className='w-full flex-1'>
                                        <InputOTPSlot className='w-full' index={0} />
                                        <InputOTPSlot className='w-full' index={1} />
                                        <InputOTPSlot className='w-full' index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup className='w-full flex-1'>
                                        <InputOTPSlot className='w-full' index={3} />
                                        <InputOTPSlot className='w-full' index={4} />
                                        <InputOTPSlot className='w-full' index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            {isBlocked ? (
                                <p className="text-destructive text-sm mt-2 text-center">
                                    {t.verifyCode.tooManyAttempts} {Math.floor(remainingSeconds! / 60)}:{(remainingSeconds! % 60).toString().padStart(2, "0")}
                                </p>
                            ) : form.formState.errors.otp && (
                                <p className="text-destructive text-sm mt-2 ">
                                    {
                                        t.validation[
                                        form.formState.errors.otp
                                            ?.message as keyof typeof t.validation
                                        ] || form.formState.errors.otp?.message
                                    }
                                </p>
                            )}

                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitDisabled} className="w-full mt-7">
                    {isPending
                        ? t.verifyCode.verifying
                        : t.verifyCode.verifyButton}
                </Button>

                <div className="flex justify-center items-center mt-3">
                    <p className="text-md text-primary ">
                        {t.verifyCode.ReceiveOtp}
                    </p>
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isBlocked || isCooldown || isResendOtpPending}
                    >
                        {isCooldown
                            ? `${t.verifyCode.resendIn} ${remainingSeconds}${t.verifyCode.seconds}`
                            : isBlocked
                                ? `${t.verifyCode.blocked} (${Math.floor(remainingSeconds! / 60)}:${(remainingSeconds! % 60)
                                    .toString()
                                    .padStart(2, "0")})`
                                : t.verifyCode.resendIt}
                    </Button>
                </div>
            </form>
        </Form >
    )
}
