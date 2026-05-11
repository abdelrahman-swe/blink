import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";

interface OrdersPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: OrdersPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("orders", lang);
    return generateSeoMetadata(seo, lang, { title: "Orders | Blink", description: "View your orders on Blink" });
}

export default function OrdersPage() {
    return <OrdersClient />;
}
