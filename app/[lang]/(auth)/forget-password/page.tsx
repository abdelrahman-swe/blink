import { getDictionary, Locale } from "@/lib/dictionaries";
import ForgetPasswordForm from "./ForgetPasswordForm";


export default async function ForgetPasswordPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return (
        <ForgetPasswordForm lang={lang} />
    );
}
