import type { Metadata } from "next";
import CartClient from "./CartClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";

interface CartPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("cart", lang);
    return generateSeoMetadata(seo, lang, { title: "Cart | Blink", description: "Your shopping cart on Blink" });
}

export default function CartPage() {
    return <CartClient />;
}
