"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ProfileAddressSchema } from "@/utils/schema/userSchema";
import { useForm } from "react-hook-form";
import {
    useAddAddress,
    useDefaultAddress,
    useDeleteAddress,
    useEditAddress,
    useGetAddresses,
    useGetGovernoratesQuery,
} from "@/hooks/queries/useUserQueries";
import { CheckmarkCircle02Icon, Delete02Icon, Home12Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from '@hugeicons/react';

import { ProfileAddressSkeleton } from "@/components/skeleton/ProfileInfoSkeleton";
import { CheckoutFormSelect } from "@/app/[lang]/(main)/checkout/components/CheckoutFormSelect";
import { CheckoutFormInput } from "@/app/[lang]/(main)/checkout/components/CheckoutFormInput";
import { useGetCitiesForGovernorateQuery } from "@/hooks/queries/useCheckoutQueries";
import { ADDRESS_ICONS } from "@/helper";


type ProfileAddressSchemaType = ReturnType<typeof ProfileAddressSchema>;
type ProfileAddressValues = z.infer<ProfileAddressSchemaType>;

interface ProfileAddressProps {
    authDict: any;
    userDict: any;
}

const ProfileAddress = ({ authDict, userDict }: ProfileAddressProps) => {
    const t = userDict?.profile?.account?.address;
    const { data: addresses, isFetching } = useGetAddresses();
    const { mutateAsync: addAddress, isPending: isAddingPending } = useAddAddress();
    const { mutateAsync: updateAddress, isPending: isUpdatingPending } = useEditAddress();
    const { mutateAsync: deleteAddress } = useDeleteAddress();
    const { mutateAsync: setDefaultAddress } = useDefaultAddress();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const schema = useMemo(() => ProfileAddressSchema(), []);

    const form = useForm<ProfileAddressValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            governorate_id: 0,
            city_id: 0,
            address: "",
            // phone: "",
            label: "",
        },
    });

    const selectedGovernorate = form.watch("governorate_id");

    const { data: governoratesResponse, isLoading: governoratesLoading } = useGetGovernoratesQuery();
    const { data: citiesResponse, isLoading: citiesLoading } = useGetCitiesForGovernorateQuery(selectedGovernorate);

    const governorateOptions = governoratesResponse?.data?.governorates || [];
    const cityOptions = citiesResponse?.data?.cities || [];
    const labelOptions = [
        { id: "Home", name: t?.labels?.home || "Home" },
        { id: "Work", name: t?.labels?.work || "Work" },
        { id: "Office", name: t?.labels?.office || "Office" },
        { id: "Other", name: t?.labels?.other || "Other" },
    ];

    /* ================= Handlers ================= */
    const handleEdit = (address: any) => {
        setEditingId(address.id);
        form.reset({
            governorate_id: address.governorate_id,
            city_id: address.city_id,
            address: address.address,
            // phone: address.phone,
            label: address.label || "Other",
        });
    };

    const handleAddNew = () => {
        setEditingId(null);
        form.reset({
            governorate_id: 0,
            city_id: 0,
            address: "",
            // phone: "",
            label: "",
        });
        setShowAddForm(true);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        form.reset();
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        form.reset();
    };

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id);
            await deleteAddress({ id });
        } finally {
            setDeletingId(null);
        }
    };

    /* ================= Submit ================= */
    const onSubmit = async (data: ProfileAddressValues) => {

        try {
            if (editingId) {
                await updateAddress({
                    id: editingId,
                    ...data,
                } as any);
            } else {
                await addAddress({
                    ...data,
                    is_default: (addresses?.data?.addresses?.length ?? 0) === 0,
                } as any);
            }
            form.reset();
            setShowAddForm(false);
            setEditingId(null);
        } catch (error) {
        }
    };

    if (!mounted || (isFetching && !addresses?.data?.addresses)) {
        return (
            <div className="mt-8 space-y-6">
                <h3 className="text-lg font-semibold">{t?.title}</h3>
                <ProfileAddressSkeleton />
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold">
                {t?.title}
            </h3>

            {/* ================= Address List ================= */}
            {addresses?.data?.addresses && addresses.data.addresses.length > 0 && (
                <div className="space-y-4">
                    {addresses.data.addresses.map((address: any) => (
                        <div
                            key={address.id}
                            className="rounded-xl border border-neutral-200 p-4 space-y-4 "
                        >
                            <div className="flex items-start justify-between gap-4 me-2 m-0!">

                                <div className="flex items-start gap-2">
                                    <HugeiconsIcon
                                        icon={ADDRESS_ICONS[address.label || "Other"] ?? Home12Icon}
                                        size={22}
                                        color="gray"
                                        strokeWidth={1.5}
                                    />

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">({t?.labels[address.label?.toLowerCase()] || address.label || "Other"})</p>
                                        <p className="text-md text-primary break-all xs:break-words">
                                            {address.address}, {address.city || address.city_id}, {address.governorate || address.governorate_id}
                                        </p>
                                        {/* <p className="text-sm text-neutral-400 mt-2">{address.phone}</p> */}
                                    </div>
                                </div>


                                <Button
                                    size="icon-sm"
                                    variant="link"
                                    className="text-neutral-500"
                                    onClick={() => handleEdit(address)}
                                >
                                    {t?.edit}
                                </Button>
                            </div>


                            <div className="flex justify-between items-center">
                                {address.is_default ? (
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-800">
                                        <HugeiconsIcon
                                            icon={CheckmarkCircle02Icon}
                                            size={20}
                                            color="#ffffff"
                                            fill="#000000"
                                            strokeWidth={1.5}

                                        />

                                        {t?.defaultAddress}
                                    </div>
                                ) : (
                                    <Button
                                        variant="link"
                                        onClick={() => setDefaultAddress({ id: address.id })}
                                        className="text-sm text-neutral-600 font-medium underline p-0"
                                    >
                                        {t?.setAsDefault}
                                    </Button>
                                )}

                                <div className="flex justify-between items-center gap-4 me-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={deletingId === address.id}
                                        onClick={() => handleDelete(address.id)}
                                        className="hover:bg-red-50 flex items-center gap-2 text-sm "
                                    >
                                        {deletingId === address.id ? (
                                            <span className="flex items-center gap-2 text-red-500 me-15">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                                {t?.removing}
                                            </span>

                                        ) : (
                                            <HugeiconsIcon
                                                icon={Delete02Icon}
                                                size={20}
                                                strokeWidth={1.5}
                                            />
                                        )}
                                    </Button>
                                </div>

                            </div>

                            {/* ================= Inline Edit Form ================= */}
                            {editingId === address.id && (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 rounded-xl border border-neutral-200 bg-neutral-50">
                                        <h4 className="font-semibold">{t?.editTitle}</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Label */}
                                            <CheckoutFormSelect
                                                control={form.control}
                                                name="label"
                                                label={t?.form?.label}
                                                placeholder={t?.form?.labelPlaceholder}
                                                options={labelOptions}
                                                errorDict={userDict.profile.account.validation}

                                            />

                                            {/* Phone */}
                                            {/* <CheckoutFormInput
                                                control={form.control}
                                                name="phone"
                                                label={t?.form?.phone}
                                                placeholder={t?.form?.phonePlaceholder}
                                                type="tel"
                                                errorDict={userDict.profile.account.validation}
                                                
                                            /> */}

                                            {/* Governorate */}
                                            <CheckoutFormSelect
                                                control={form.control}
                                                name="governorate_id"
                                                label={t?.form?.governorate}
                                                placeholder={t?.form?.governoratePlaceholder}
                                                options={governorateOptions}
                                                isLoading={governoratesLoading}
                                                errorDict={userDict.profile.account.validation}

                                            />

                                            {/* City */}
                                            <CheckoutFormSelect
                                                control={form.control}
                                                name="city_id"
                                                label={t?.form?.city}
                                                placeholder={t?.form?.cityPlaceholder}
                                                options={cityOptions}
                                                isLoading={citiesLoading}
                                                disabled={!selectedGovernorate}
                                                errorDict={userDict.profile.account.validation}

                                            />

                                            {/* Address */}
                                            <CheckoutFormInput
                                                control={form.control}
                                                name="address"
                                                label={t?.form?.address}
                                                placeholder={t?.form?.addressPlaceholder}
                                                errorDict={userDict.profile.account.validation}
                                            />

                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCancelEdit}
                                            >
                                                {t?.cancel}
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isUpdatingPending}
                                            >
                                                {isUpdatingPending ? t?.updating : t?.updateAddress}
                                            </Button>

                                        </div>
                                    </form>
                                </Form>
                            )}

                        </div>
                    ))}
                </div>
            )}


            {/* ================= Empty State ================= */}
            {!isFetching &&
                addresses?.data?.addresses &&
                addresses.data.addresses.length === 0 &&
                !showAddForm && (
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-5">
                        <Image src="/address.svg" alt="empty-address" width={100} height={100} />
                        <h3 className="font-semibold text-lg">
                            {t?.emptyTitle}
                        </h3>
                        <p className="text-sm text-neutral-700 text-center max-w-md">
                            {t?.emptyDesc}
                        </p>
                        <Button
                            onClick={handleAddNew}
                            className="rounded-3xl px-6"
                        >
                            {t?.addNew}
                        </Button>
                    </div>
                )}

            {/* ================= Add New Address Button ================= */}
            {addresses?.data?.addresses && addresses.data.addresses.length > 0 && !showAddForm && !editingId && (
                <div className="flex justify-end">
                    <Button
                        onClick={handleAddNew}
                        className="rounded-full px-6"
                    >
                        {t?.addNew}
                    </Button>
                </div>
            )}

            {/* ================= Add New Address Form ================= */}
            {showAddForm && (
                <div className="scroll-mt-32">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 rounded-xl border border-neutral-200 bg-neutral-50">
                            <h4 className="font-semibold">{t?.addNewTitle}</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Label */}
                                <CheckoutFormSelect
                                    control={form.control}
                                    name="label"
                                    label={t?.form?.label}
                                    placeholder={t?.form?.labelPlaceholder}
                                    options={labelOptions}
                                    errorDict={userDict.profile.account.validation}

                                />

                                {/* Phone */}
                                {/* <CheckoutFormInput
                                    control={form.control}
                                    name="phone"
                                    label={t?.form?.phone}
                                    placeholder={t?.form?.phonePlaceholder}
                                    type="tel"
                                    errorDict={userDict.profile.account.validation}
                                    
                                /> */}

                                {/* Governorate */}
                                <CheckoutFormSelect
                                    control={form.control}
                                    name="governorate_id"
                                    label={t?.form?.governorate}
                                    placeholder={t?.form?.governoratePlaceholder}
                                    options={governorateOptions}
                                    isLoading={governoratesLoading}
                                    errorDict={userDict.profile.account.validation}

                                />

                                {/* City */}
                                <CheckoutFormSelect
                                    control={form.control}
                                    name="city_id"
                                    label={t?.form?.city}
                                    placeholder={t?.form?.cityPlaceholder}
                                    options={cityOptions}
                                    isLoading={citiesLoading}
                                    disabled={!selectedGovernorate}
                                    errorDict={userDict.profile.account.validation}

                                />


                                {/* Address */}
                                <CheckoutFormInput
                                    control={form.control}
                                    name="address"
                                    label={t?.form?.address}
                                    placeholder={t?.form?.addressPlaceholder}
                                    errorDict={userDict.profile.account.validation}

                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelAdd}
                                >
                                    {t?.cancel}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isAddingPending}
                                    className="min-w-[160px]"
                                >
                                    {isAddingPending ? t?.saving : t?.saveAddress}
                                </Button>

                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default ProfileAddress;
