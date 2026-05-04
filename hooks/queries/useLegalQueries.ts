import { useQuery } from "@tanstack/react-query";
import { LegalResponse, getPrivacyPolicy, getTermsAndConditions, getReturnPolicy, getContactUs } from "@/utils/services/legal";

export function getPrivacyPolicyQuery(options: { enabled?: boolean } = {}) {
    return useQuery<LegalResponse, Error>({
        queryKey: ["privacy-policy"],
        queryFn: getPrivacyPolicy,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: false,
        enabled: options.enabled !== false,
    });
}

export function getTermsAndConditionsQuery(options: { enabled?: boolean } = {}) {
    return useQuery<LegalResponse, Error>({
        queryKey: ["terms-and-conditions"],
        queryFn: getTermsAndConditions,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: false,
        enabled: options.enabled !== false,
    });
}

export function getReturnPolicyQuery(options: { enabled?: boolean } = {}) {
    return useQuery<LegalResponse, Error>({
        queryKey: ["return-policy"],
        queryFn: getReturnPolicy,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: false,
        enabled: options.enabled !== false,
    });
}

export function getContactUsQuery(options: { enabled?: boolean } = {}) {
    return useQuery<LegalResponse, Error>({
        queryKey: ["contact-us"],
        queryFn: getContactUs,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: false,
        enabled: options.enabled !== false,
    });
}