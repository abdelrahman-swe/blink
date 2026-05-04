import { getDictionary, Locale } from "@/lib/dictionaries";
import SecuritySettingsContent from "./SecuritySettingsContent";

const SecuritySettingsPage = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
    const { lang } = await params;
    const authDict = await getDictionary(lang, "auth");

    return <SecuritySettingsContent lang={lang} authDict={authDict} />;
}

export default SecuritySettingsPage;
