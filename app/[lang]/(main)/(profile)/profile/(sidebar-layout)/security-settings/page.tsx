import type { Metadata } from "next";
import { getDictionary, Locale } from "@/lib/dictionaries";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import SecuritySettingsContent from "./SecuritySettingsContent";

interface SecurityPageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: SecurityPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("security-settings", lang);
    return generateSeoMetadata(seo, lang, { title: "Security Settings | Blink", description: "Manage your security settings on Blink" });
}

const SecuritySettingsPage = async ({ params }: SecurityPageProps) => {
    const { lang } = await params;
    const authDict = await getDictionary(lang, "auth");

    return <SecuritySettingsContent lang={lang} authDict={authDict} />;
}

export default SecuritySettingsPage;
