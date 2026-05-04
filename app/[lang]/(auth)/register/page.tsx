import { getDictionary, Locale } from "@/lib/dictionaries";
import RegisterForm from "./RegisterForm";



export default async function RegisterPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return (
        <RegisterForm lang={lang} />
    );
}
