"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ProfileInfoSchema } from "@/utils/schema/userSchema";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
    useProfileAccount,
    useUpdateProfile,
} from "@/hooks/queries/useUserQueries";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UpdateProfilePayload } from "@/utils/types/user";
import { Label } from "@/components/ui/label";
import VerifyProfilePhoneDialog from "./VerifyProfilePhoneDialog";
import { ProfileInfoSkeleton } from "@/components/skeleton/ProfileInfoSkeleton";

import {
    Edit02Icon,
    CheckmarkCircle03Icon,
    Loading03Icon,
    PencilEdit02Icon,
    UserCircleIcon,
    Edit04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ProfileInfoSchemaType = ReturnType<typeof ProfileInfoSchema>;
type ProfileInfoValues = z.infer<ProfileInfoSchemaType> & {
    avatar?: File;
};

interface ProfileInfoProps {
    authDict: any;
    userDict: any;
}

const ProfileInfo = ({ authDict, userDict }: ProfileInfoProps) => {
    const t = userDict?.profile?.account?.info;
    const { data: profile, isFetching, isLoading } = useProfileAccount();
    const { mutateAsync: updateProfile } = useUpdateProfile();

    const schema = useMemo(() => ProfileInfoSchema(), []);

    const [verifyAccountDialog, setVerifyAccountDialog] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState<string | null>(null);

    const [editingField, setEditingField] =
        useState<"full_name" | "email" | "phone" | null>(null);

    const [savingField, setSavingField] =
        useState<"full_name" | "email" | "phone" | null>(null);

    const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const form = useForm<ProfileInfoValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
        },
    });

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingField === "full_name") nameRef.current?.focus();
        if (editingField === "phone") phoneRef.current?.focus();
        if (editingField === "email") emailRef.current?.focus();
    }, [editingField]);

    const closeOtpDialog = () => {
        setVerifyAccountDialog(false);
        setReceivedOtp(null);
    };

    const handleSave = async (
        field: "full_name" | "email" | "phone"
    ) => {
        const isValid = await form.trigger(field);
        if (!isValid) return;

        setSavingField(field);

        const payload: UpdateProfilePayload = {
            full_name: form.getValues("full_name"),
            email: form.getValues("email"),
            phone: form.getValues("phone"),
        };

        try {
            const response: any = await updateProfile(payload);

            const isOtpRequired =
                response?.otp_required ||
                response?.data?.otp_required ||
                response?.otp ||
                response?.data?.otp ||
                response?.message?.toLowerCase().includes("verify");

            if ((field === "phone" || field === "email") && isOtpRequired) {
                setReceivedOtp(response?.otp || response?.data?.otp || null);
                setVerifyAccountDialog(true);
            }
        } catch (error: any) {
            const errData = error?.response?.data || error;
            
            let isFieldErrorSet = false;

            if (errData?.data) {
                if (errData.data.email?.[0]) {
                    form.setError("email", { type: "manual", message: errData.data.email[0] });
                    isFieldErrorSet = true;
                }
                if (errData.data.phone?.[0]) {
                    form.setError("phone", { type: "manual", message: errData.data.phone[0] });
                    isFieldErrorSet = true;
                }
                if (errData.data.full_name?.[0]) {
                    form.setError("full_name", { type: "manual", message: errData.data.full_name[0] });
                    isFieldErrorSet = true;
                }
            } 
            
            if (!isFieldErrorSet && errData?.message) {
                form.setError(field, { type: "manual", message: errData.message });
            }

            setSavingField(null);
            return;
        }
        
        setSavingField(null);
        setEditingField(null);
    };

    const inputHandlers = (
        field: "full_name" | "email" | "phone"
    ) => ({
        readOnly: editingField !== field || savingField === field,
        onBlur: () => editingField === field && handleSave(field),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSave(field);
            }
        },
    });

    const renderIconButton = (
        field: "full_name" | "email" | "phone"
    ) => {
        const isEditing = editingField === field;
        const isSaving = savingField === field;

        return (
            <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                disabled={isSaving}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                    if (isSaving) return;
                    isEditing ? handleSave(field) : setEditingField(field);
                }}
                className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2"
            >
                <span className="transition-all duration-200 scale-100">
                    {isSaving ? (
                        <HugeiconsIcon
                            icon={Loading03Icon}
                            size={20}
                            className="animate-spin"
                        />
                    ) : isEditing ? (
                        <HugeiconsIcon
                            icon={CheckmarkCircle03Icon}
                            size={20}
                            color="#16a34a"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <HugeiconsIcon
                            icon={Edit04Icon}
                            size={20}
                            strokeWidth={1.5}
                        />
                    )}
                </span>
            </Button>
        );
    };

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleAvatarChange = async (file: File) => {
        form.setValue("avatar", file);
        const isValid = await form.trigger("avatar");
        if (!isValid) return;

        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        setIsAvatarUpdating(true);

        try {
            await updateProfile({
                avatar: file,
                full_name: form.getValues("full_name"),
                email: form.getValues("email"),
                phone: form.getValues("phone"),
            });
        } finally {
            setIsAvatarUpdating(false);
            setAvatarPreview(null);
        }
    };

    useEffect(() => {
        if (profile?.data) {
            form.reset({
                full_name: profile.data.full_name || "",
                email: profile.data.email || "",
                phone: profile.data.phone || "",
            });
        }
    }, [profile, form]);

    if (!mounted || isLoading || (isFetching && !profile?.data)) {
        return <ProfileInfoSkeleton />;
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-[60px] h-[60px] rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                {avatarPreview || profile?.data?.avatar?.original ? (
                                    <Image
                                        src={
                                            avatarPreview ||
                                            profile?.data?.avatar?.original ||
                                            "https://github.com/shadcn.png"
                                        }
                                        alt="User"
                                        width={60}
                                        height={60}
                                        className="object-fill aspect-square rounded-full flex justify-center items-center"
                                    />
                                ) : (
                                    <HugeiconsIcon
                                        icon={UserCircleIcon}
                                        size={40}
                                        color="#999"
                                        strokeWidth={1.5}
                                    />
                                )}
                            </div>
                            {isAvatarUpdating && (
                                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                                    <HugeiconsIcon
                                        icon={Loading03Icon}
                                        size={20}
                                        className="animate-spin text-white"
                                    />
                                </div>
                            )}
                        </div>


                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="avatar"
                            disabled={isAvatarUpdating}
                            onChange={(e) =>
                                e.target.files?.[0] &&
                                handleAvatarChange(e.target.files[0])
                            }
                        />


                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="avatar"
                                className={`underline text-sm ${isAvatarUpdating ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            >
                                {t?.editPhoto}
                            </Label>
                            {form.formState.errors.avatar && (
                                <p className="text-destructive text-sm">
                                    {userDict?.profile?.account?.validation[
                                        form.formState.errors.avatar
                                            ?.message as keyof typeof userDict.profile.account.validation
                                    ] || form.formState.errors.avatar?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5">
                        {/* Full Name */}
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Field>
                                            <FieldLabel>
                                                {t?.form?.fullName}
                                            </FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    placeholder={t?.form?.fullNamePlaceholder}
                                                    ref={(e) => {
                                                        field.ref(e);
                                                        nameRef.current = e;
                                                    }}
                                                    {...inputHandlers(
                                                        "full_name"
                                                    )}
                                                    className="ltr:pr-10 rtl:pl-10 h-11 border-gray-300 rtl:text-right"
                                                />
                                                {renderIconButton(
                                                    "full_name"
                                                )}
                                            </div>
                                        </Field>
                                    </FormControl>
                                    {form.formState.errors.full_name && (
                                        <p className="text-destructive text-sm">
                                            {userDict?.profile?.account?.validation[form.formState.errors.full_name?.message as keyof typeof userDict.profile.account.validation] || form.formState.errors.full_name?.message}
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
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Field>
                                            <FieldLabel>
                                                {t?.form?.phone}
                                            </FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    placeholder={t?.form?.phonePlaceholder}
                                                    ref={(e) => {
                                                        field.ref(e);
                                                        phoneRef.current =
                                                            e;
                                                    }}
                                                    {...inputHandlers(
                                                        "phone"
                                                    )}
                                                    className="ltr:pr-10 rtl:pl-10 h-11 border-gray-300 rtl:text-right"
                                                />
                                                {renderIconButton("phone")}
                                            </div>
                                        </Field>
                                    </FormControl>
                                    {form.formState.errors.phone && (
                                        <p className="text-destructive text-sm">
                                            {userDict?.profile?.account?.validation[form.formState.errors.phone?.message as keyof typeof userDict.profile.account.validation] || form.formState.errors.phone?.message}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Field>
                                        <FieldLabel>
                                            {t?.form?.email}
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                placeholder={t?.form?.emailPlaceholder}
                                                ref={(e) => {
                                                    field.ref(e);
                                                    emailRef.current = e;
                                                }}
                                                {...inputHandlers("email")}
                                                className="ltr:pr-10 rtl:pl-10 h-11 border-gray-300 rtl:text-right"
                                            />
                                            {renderIconButton("email")}
                                        </div>
                                    </Field>
                                </FormControl>
                                {form.formState.errors.email && (
                                    <p className="text-destructive text-sm">
                                        {userDict?.profile?.account?.validation[form.formState.errors.email?.message as keyof typeof userDict.profile.account.validation] || form.formState.errors.email?.message}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />

                    <Separator />
                </form>
            </Form>

            <VerifyProfilePhoneDialog
                open={verifyAccountDialog}
                onOpenChange={(open) => !open && closeOtpDialog()}
                phone={form.getValues("phone")}
                email={form.getValues("email")}
                authDict={authDict}
                userDict={userDict}
                otp={receivedOtp}
                onVerified={closeOtpDialog}
            />
        </div>
    );
};

export default ProfileInfo;