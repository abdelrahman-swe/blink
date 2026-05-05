"use client";

import { useEffect } from "react";
import { ProductSeo } from "@/utils/types/product";

interface ProductSeoHeadProps {
    seo?: ProductSeo;
    fallbackTitle?: string;
}

/**
 * Dynamically injects SEO meta tags, OpenGraph tags, alternate links,
 * and JSON-LD structured data into the document <head>.
 * 
 * Since the product page is a client component, we can't use Next.js
 * generateMetadata. This component handles it via useEffect instead.
 */
export function ProductSeoHead({ seo, fallbackTitle }: ProductSeoHeadProps) {
    useEffect(() => {
        if (!seo) return;

        const cleanupTags: HTMLElement[] = [];

        // Helper to create/update a meta tag
        const setMeta = (attr: "name" | "property", key: string, content: string) => {
            // Remove existing tag if any
            const existing = document.querySelector(`meta[${attr}="${key}"]`);
            if (existing) existing.remove();

            const tag = document.createElement("meta");
            tag.setAttribute(attr, key);
            tag.setAttribute("content", content);
            document.head.appendChild(tag);
            cleanupTags.push(tag);
        };

        // Helper to create a link tag
        const setLink = (rel: string, attrs: Record<string, string>) => {
            const tag = document.createElement("link");
            tag.setAttribute("rel", rel);
            Object.entries(attrs).forEach(([k, v]) => tag.setAttribute(k, v));
            document.head.appendChild(tag);
            cleanupTags.push(tag);
        };

        // --- Title ---
        const prevTitle = document.title;
        if (seo.meta?.title) {
            document.title = seo.meta.title;
        }

        // --- Meta tags ---
        if (seo.meta?.description) {
            setMeta("name", "description", seo.meta.description);
        }
        if (seo.meta?.robots) {
            setMeta("name", "robots", seo.meta.robots);
        }

        // --- Canonical ---
        if (seo.meta?.canonical) {
            // Remove existing canonical
            const existingCanonical = document.querySelector('link[rel="canonical"]');
            if (existingCanonical) existingCanonical.remove();
            setLink("canonical", { href: seo.meta.canonical });
        }

        // --- OpenGraph tags ---
        if (seo.og) {
            if (seo.og.title) setMeta("property", "og:title", seo.og.title);
            if (seo.og.description) setMeta("property", "og:description", seo.og.description);
            if (seo.og.image) setMeta("property", "og:image", seo.og.image);
            if (seo.og.type) setMeta("property", "og:type", seo.og.type);
            if (seo.og.url) setMeta("property", "og:url", seo.og.url);
            if (seo.og.site_name) setMeta("property", "og:site_name", seo.og.site_name);
            if (seo.og.locale) setMeta("property", "og:locale", seo.og.locale);
        }

        // --- Alternate language links ---
        if (seo.alternates?.length) {
            // Remove existing alternates
            document.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove());
            for (const alt of seo.alternates) {
                setLink("alternate", { hreflang: alt.lang, href: alt.href });
            }
        }

        // --- JSON-LD structured data ---
        if (seo.jsonLd?.length) {
            for (const ld of seo.jsonLd) {
                const script = document.createElement("script");
                script.setAttribute("type", "application/ld+json");
                script.textContent = JSON.stringify(ld);
                document.head.appendChild(script);
                cleanupTags.push(script);
            }
        }

        // Cleanup on unmount or when seo changes
        return () => {
            document.title = prevTitle;
            cleanupTags.forEach((tag) => {
                if (tag.parentNode) tag.parentNode.removeChild(tag);
            });
        };
    }, [seo, fallbackTitle]);

    return null;
}
