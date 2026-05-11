"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useOtpResendLimiter } from "@/hooks/useOtpResendLimiter";
import { useResendProfileOtp, useVerifyProfileInfo } from "@/hooks/queries/useUserQueries";
import { verifyProfilePhoneSchema } from "@/utils/schema/userSchema";
import AppLink from "@/components/common/AppLink";

type VerifyProfilePhoneDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVerified?: () => void;
    phone?: string;
    email?: string;
    authDict: any;
    userDict: any;
    otp?: string | null;
    blockedRemaining?: number | null;
};

type VerifySchema = ReturnType<typeof verifyProfilePhoneSchema>;
type VerifyValues = z.infer<VerifySchema>;

const VerifyProfilePhoneDialog = ({
    open,
    onOpenChange,
    onVerified,
    phone,
    email,
    userDict,
    blockedRemaining,
}: VerifyProfilePhoneDialogProps) => {
    const schema = useMemo(() => verifyProfilePhoneSchema(), []);
    const { mutate: verifyProfileInfo, isPending } = useVerifyProfileInfo();
    const { mutate: resendOtpMutation, isPending: isResendOtpPending } = useResendProfileOtp();

    const {
        isBlocked,
        isCooldown,
        remainingSeconds,
        onResendSuccess,
        triggerBlock,
    } = useOtpResendLimiter("profile-phone", 3, phone);

    useEffect(() => {
        if (open && blockedRemaining) {
            triggerBlock(blockedRemaining, phone);
        }
    }, [open, blockedRemaining, phone, triggerBlock]);

    const form = useForm<VerifyValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
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


    const handleResendOtp = () => {
        if ((!phone && !email) || isBlocked || isCooldown) return;

        resendOtpMutation(
            { phone: phone || "", email: email || "" },
            {
                onSuccess: (data) => {
                    onResendSuccess();
                    toast.success(userDict.profile.account.verifyPhoneOtp.success || "OTP sent successfully");
                },
                onError: (error: any) => {
                    if (error.response?.status === 429) {
                        const retryAfter = error.response?.data?.data?.retry_after;
                        triggerBlock(retryAfter, phone);
                    }
                    const message = error.response?.data?.message || userDict.profile.account.verifyPhoneOtp.failed || "Verification failed";
                    form.setError("otp", { message });
                }
            }
        );
    };

    const onSubmit = (data: VerifyValues) => {
        verifyProfileInfo(
            {
                otp: data.otp,
            },
            {
                onSuccess: () => {
                    toast.success(
                        userDict.profile.account.verifyPhoneOtp.success ||
                        "Phone/Email verified successfully"
                    );

                    onVerified?.();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    form.setError("otp", {
                        message:
                            error.response?.data?.message ||
                            userDict.profile.account.verifyPhoneOtp.failed ||
                            "Verification failed",
                    });
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-lg py-15"
            >
                <DialogTitle className="sr-only">
                    Verify Phone/Email
                </DialogTitle>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col justify-center items-center gap-5">
                            <h1 className="text-3xl font-medium text-primary ">{userDict.profile.account.verifyPhoneOtp.title}</h1>
                            {(phone || email) && (
                                <p className="text-primary text-center leading-7 max-w-[250px]">
                                    {userDict.profile.account.verifyPhoneOtp.subtitle}
                                </p>
                            )}
                            <p className="text-primary text-center">{userDict.profile.account.verifyPhoneOtp.wrongPhoneOrEmail}
                                <Button className='text-primary font-medium' variant="link" onClick={() => onOpenChange(false)} >
                                    {userDict.profile.account.verifyPhoneOtp.edit}
                                </Button>
                            </p>
                        </div>
                        {/* OTP Input */}
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="mt-5 w-100 mx-auto">
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            value={field.value || ""}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                if (value.length === 6) {
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
                                            {userDict.profile.account.verifyPhoneOtp.tooManyAttempts} {Math.floor(remainingSeconds! / 60)}:{(remainingSeconds! % 60).toString().padStart(2, "0")}
                                        </p>
                                    ) : form.formState.errors.otp && (
                                        <p className="text-destructive text-sm mt-2 text-center">
                                            {
                                                userDict?.profile?.account?.validation[
                                                form.formState.errors.otp
                                                    ?.message as keyof typeof userDict.profile.account.validation
                                                ] ||
                                                form.formState.errors.otp?.message
                                            }
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-100 mx-auto flex justify-center items-center mt-7 rounded-lg h-11 text-lg"
                        >
                            {isPending
                                ? userDict.profile.account.verifyPhoneOtp.verifying
                                : userDict.profile.account.verifyPhoneOtp.verifyButton}
                        </Button>

                        <div className="flex justify-center items-center mt-3">
                            <p className="text-md text-primary ">
                                {userDict.profile.account.verifyPhoneOtp.ReceiveOtp}
                            </p>
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isBlocked || isCooldown || isResendOtpPending}
                            >
                                {isCooldown
                                    ? userDict.profile.account.verifyPhoneOtp.resendIn.replace("{seconds}", (remainingSeconds || 0).toString())
                                    : isBlocked
                                        ? userDict.profile.account.verifyPhoneOtp.blocked.replace("{time}", `${Math.floor(remainingSeconds! / 60)}:${(remainingSeconds! % 60)
                                            .toString()
                                            .padStart(2, "0")}`)
                                        : userDict.profile.account.verifyPhoneOtp.resendIt}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default VerifyProfilePhoneDialog;
