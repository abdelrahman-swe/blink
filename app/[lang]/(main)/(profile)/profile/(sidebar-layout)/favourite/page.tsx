import type { Metadata } from "next";
import FavouriteClient from "./FavouriteClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";

interface WishlistPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("wishlist", lang);
    return generateSeoMetadata(seo, lang, { title: "Wishlist | Blink", description: "Your favourite products on Blink" });
}

export default function WishlistPage() {
    return <FavouriteClient />;
}
