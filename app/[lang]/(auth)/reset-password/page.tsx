import { getDictionary, Locale } from "@/lib/dictionaries";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return (
        <ResetPasswordForm lang={lang} />
    );
}
