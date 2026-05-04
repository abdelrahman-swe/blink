import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { CheckoutFormInput } from "./CheckoutFormInput";
import { CheckoutFormSelect } from "./CheckoutFormSelect";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGetCitiesForGovernorateQuery, useGetGovernoratesQuery } from "@/hooks/queries/useCheckoutQueries";
import AppLink from '@/components/common/AppLink';
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useGetAddresses } from "@/hooks/queries/useUserQueries";
import { Location10Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface CheckoutFormProps {
    form: UseFormReturn<any>;
    translations: any;
}

export function CheckoutForm({ form, translations: t }: CheckoutFormProps) {
    const { lang } = useParams<{ lang: string }>();

    const { control, watch, setValue, trigger } = form;


    const { isAuthenticated } = useUserStore();
    const { data: addressesResponse, isLoading: addressesLoading } = useGetAddresses();
    const addresses = addressesResponse?.data?.addresses || [];

    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | number>("");
    const [targetCityName, setTargetCityName] = useState<string | null>(null);
    const [targetGovernorateName, setTargetGovernorateName] = useState<string | null>(null);
    const [pendingCityId, setPendingCityId] = useState<number | null>(null);
    const [pendingCityName, setPendingCityName] = useState<string | null>(null);

    const selectedGovernorate = watch("shipping_address.governorate_id");
    const { data: governoratesResponse, isLoading: governoratesLoading } = useGetGovernoratesQuery();
    const { data: citiesResponse, isLoading: citiesLoading } = useGetCitiesForGovernorateQuery(selectedGovernorate);

    const governorates = governoratesResponse?.data?.governorates || [];
    const cities = citiesResponse?.data?.cities || [];

    const addressOptions = useMemo(() => {
        // Sort: Default address first
        const sortedAddresses = [...addresses].sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
        
        return [
            ...sortedAddresses.map((addr: any) => ({
                id: addr.id,
                name: (
                    <div className="flex rtl:flex-row-reverse items-center gap-1">
                        <HugeiconsIcon
                            icon={Location10Icon}
                            size={24}
                            color="#000000"
                            className="text-black"
                            strokeWidth={1.5}
                        />
                        <span>{`${addr.is_default ? `(${t.form.default}) ` : ""}${addr.address}, ${addr.city || addr.city_id}, ${addr.governorate || addr.governorate_id}`}</span>
                    </div>
                ),
            })),
            { 
                id: "new", 
                name: (
                    <div className="flex items-center gap-2">
                        {/* <span className="text-xl leading-none font-medium mb-1 px-[5px]">+</span> */}
                        <span>{t.form?.addNewAddress}</span>
                    </div>
                )
            },
        ];
    }, [addresses, t.form?.addNewAddress, t.form?.default]);

    const handleAddressChange = useCallback((value: string | number) => {
        setSelectedAddressId(value);
        if (value === "new") {
            setIsAddingNewAddress(true);
            setTargetCityName(null);
            setTargetGovernorateName(null);
            setPendingCityId(null);
            setPendingCityName(null);
            setValue("shipping_address", { address: "", city_id: 0, governorate_id: 0 });
        } else {
            const selectedAddr = addresses.find((addr: any) => String(addr.id) === String(value));
            if (selectedAddr) {
                setIsAddingNewAddress(false);

                // Always set the address text immediately
                setValue("shipping_address.address", selectedAddr.address || "", { shouldValidate: true, shouldDirty: true });

                let gId = Number(selectedAddr.governorate_id || 0);
                const gName = selectedAddr.governorate || (selectedAddr as any).government;

                // Try to resolve governorate_id immediately if governorates are loaded
                if (gId === 0 && gName && governorates.length > 0) {
                    const foundG = governorates.find((g: any) => g.name.toLowerCase() === gName.toLowerCase());
                    if (foundG) gId = Number(foundG.id);
                }

                if (gId > 0) {
                    // Governorate resolved — set it and handle city
                    setTargetGovernorateName(null);
                    setValue("shipping_address.governorate_id", gId, { shouldValidate: true, shouldDirty: true });

                    if (Number(selectedAddr.city_id) > 0) {
                        setValue("shipping_address.city_id", Number(selectedAddr.city_id), { shouldValidate: true, shouldDirty: true });
                        setTargetCityName(null);
                        setPendingCityId(null);
                        setPendingCityName(null);
                    } else {
                        // Defer city resolution by name once cities load
                        setValue("shipping_address.city_id", 0, { shouldValidate: false });
                        setTargetCityName(selectedAddr.city || null);
                        setPendingCityId(null);
                        setPendingCityName(null);
                    }
                } else {
                    // Governorate not resolved yet — defer until governorates load
                    setTargetGovernorateName(gName || null);
                    setValue("shipping_address.governorate_id", 0, { shouldValidate: false });
                    setValue("shipping_address.city_id", 0, { shouldValidate: false });
                    // Save city info to apply after governorate resolves
                    if (Number(selectedAddr.city_id) > 0) {
                        setPendingCityId(Number(selectedAddr.city_id));
                        setPendingCityName(null);
                        setTargetCityName(null);
                    } else {
                        setPendingCityId(null);
                        setPendingCityName(selectedAddr.city || null);
                        setTargetCityName(null);
                    }
                }
            }
        }
    }, [addresses, governorates, setValue]);

    // Resolve governorate name → ID once governorates list loads
    useEffect(() => {
        if (targetGovernorateName && governorates.length > 0) {
            const foundG = governorates.find((g: any) => g.name.toLowerCase() === targetGovernorateName.toLowerCase());
            if (foundG) {
                const gId = Number(foundG.id);
                setValue("shipping_address.governorate_id", gId, { shouldValidate: true, shouldDirty: true });
                setTargetGovernorateName(null);
                // Now apply the pending city info
                if (pendingCityId && pendingCityId > 0) {
                    setValue("shipping_address.city_id", pendingCityId, { shouldValidate: true, shouldDirty: true });
                    setPendingCityId(null);
                    trigger("shipping_address");
                } else if (pendingCityName) {
                    setTargetCityName(pendingCityName);
                    setPendingCityName(null);
                }
            }
        }
    }, [targetGovernorateName, governorates, pendingCityId, pendingCityName, setValue, trigger]);

    // Resolve city name → ID once cities list loads
    useEffect(() => {
        if (targetCityName && cities.length > 0) {
            const foundC = cities.find((c: any) => c.name.toLowerCase() === targetCityName.toLowerCase());
            if (foundC) {
                setValue("shipping_address.city_id", Number(foundC.id), { shouldValidate: true, shouldDirty: true });
                setTargetCityName(null);
                trigger("shipping_address");
            }
        }
    }, [targetCityName, cities, setValue, trigger]);

    const currentShippingAddress = watch("shipping_address.address");

    useEffect(() => {
        if (!addressesLoading && addresses.length > 0) {
            if (!currentShippingAddress && !isAddingNewAddress) {
                const defaultAddress = addresses.find((addr: any) => addr.is_default) || addresses[0];
                if (defaultAddress) {
                    handleAddressChange(defaultAddress.id);
                }
            } else if (currentShippingAddress && !selectedAddressId) {
                // We restored an address string (e.g. from localStorage failure), but
                // the dropdown has no selection. Match string to ID.
                const match = addresses.find((addr: any) => addr.address === currentShippingAddress);
                if (match) {
                    setSelectedAddressId(match.id);
                    setIsAddingNewAddress(false);
                } else {
                    // It doesn't match an existing ID — it was a drafted "new" address
                    setSelectedAddressId("new");
                    setIsAddingNewAddress(true);
                }
            }
        }
    }, [addresses, addressesLoading, currentShippingAddress, isAddingNewAddress, handleAddressChange, selectedAddressId]);

    useEffect(() => {
        if (!addressesLoading && isAuthenticated && addresses.length === 0) {
            const currentVal = watch("shipping_address");
            if (currentVal?.address !== "" || currentVal?.city_id !== 0 || currentVal?.governorate_id !== 0) {
                setValue("shipping_address", { address: "", city_id: 0, governorate_id: 0 }, { shouldDirty: false });
            }
        }
    }, [addresses.length, addressesLoading, isAuthenticated, setValue, watch]);

    return (
        <div className="space-y-6 xl:w-[600px]">
            <h2 className="font-medium text-xl mb-8">{t.form.accountDetails}</h2>

            {/* Personal Info */}
            <CheckoutFormInput
                control={control}
                name="full_name"
                label={t.form.fullName}
                placeholder={t.form.fullNamePlaceholder}
                errorDict={t.form}
                required
            />
            <CheckoutFormInput
                control={control}
                name="email"
                label={t.form.email}
                placeholder={t.form.emailPlaceholder}
                errorDict={t.form}
                required
            />
            <CheckoutFormInput
                control={control}
                name="phone_number"
                label={t.form.phone}
                type="tel"
                placeholder={t.form.phonePlaceholder}
                errorDict={t.form}
                required
            />

            {/* Delivery Address */}
            <h2 className="font-medium text-xl mt-8">{t.form.deliveryAddress}</h2>


            {isAuthenticated && addresses.length > 0 && !isAddingNewAddress && (
                <div className="space-y-4">
                    <CheckoutFormSelect
                        control={control}
                        name="_ignored_unused" // Local state handles this now
                        label={t.form.selectAddress}
                        placeholder={t.form.selectAddressPlaceholder}
                        options={addressOptions}
                        isLoading={addressesLoading}
                        errorDict={t.form}
                        value={selectedAddressId as any} // Forced to use local state value
                        onChangeOverride={handleAddressChange}
                    />
                </div>
            )}

            <div className={isAuthenticated && addresses.length > 0 && !isAddingNewAddress ? "hidden" : "block space-y-4"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CheckoutFormSelect
                        control={control}
                        name="shipping_address.governorate_id"
                        label={t.form.governorate}
                        placeholder={t.form.governoratePlaceholder}
                        options={governorates}
                        isLoading={governoratesLoading}
                        errorDict={t.form}
                        required
                    />
                    <CheckoutFormSelect
                        control={control}
                        name="shipping_address.city_id"
                        label={t.form.city}
                        placeholder={t.form.cityPlaceholder}
                        options={cities}
                        isLoading={citiesLoading}
                        disabled={!selectedGovernorate}
                        errorDict={t.form}
                        required
                    />
                </div>

                <CheckoutFormInput
                    control={control}
                    name="shipping_address.address"
                    label={t.form.address}
                    placeholder={t.form.addressPlaceholder}
                    errorDict={t.form}
                    required
                />
            </div>

            {isAuthenticated && addresses.length > 0 && isAddingNewAddress && (
                <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-primary font-medium"
                    onClick={() => {
                        setIsAddingNewAddress(false);
                        if (addresses[0]) {
                            handleAddressChange(addresses[0].id);
                        }
                    }}
                >
                    {t.form.useExistingAddress}
                </Button>
            )}

            {/* Order Notes */}
            <div className="space-y-3">
                <Label htmlFor="notes">
                    {t.form.notes}
                </Label>
                <Controller
                    control={control}
                    name="notes"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id="notes"
                            placeholder={t.form.notesPlaceholder}
                            className="min-h-[100px] resize-none border-[#E6E6E6] shadow-2xs"
                            aria-label={t.form.notes}
                        />
                    )}
                />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2 mt-3">
                <Controller
                    control={control}
                    name="terms"
                    render={({ field }) => (
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-1">
                                <Checkbox
                                    id="terms"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <Label
                                    htmlFor="terms"
                                    className="
                                     flex items-start gap-3
                                     text-sm sm:text-md
                                     text-primary
                                     cursor-pointer
                                     font-normal
                                     leading-snug
                                   "
                                >
                                    <span>
                                        {t.form.termsPrefix}{" "}
                                        <AppLink href={`/${lang}/terms-conditions`} className="font-semibold underline" target="_blank" rel="noopener noreferrer">
                                            {t.form.termsLink}
                                        </AppLink>{" "}
                                        {t.form.termsMiddle}{" "}
                                        <AppLink href={`/${lang}/privacy-policy`} className="font-semibold underline" target="_blank" rel="noopener noreferrer">
                                            {t.form.privacyLink}
                                        </AppLink>
                                    </span>
                                </Label>

                            </div>
                            {form.formState.errors.terms && (
                                <p className="text-destructive text-sm">
                                    {
                                        t.form[
                                        form.formState.errors.terms
                                            ?.message as keyof typeof t.form
                                        ] || form.formState.errors.terms?.message
                                    }
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>

        </div>
    );
}
