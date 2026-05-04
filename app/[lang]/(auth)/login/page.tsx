import { getDictionary, Locale } from "@/lib/dictionaries";
import LoginForm from "./LoginForm";



export default async function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return (
        <LoginForm lang={lang} />
    );
}
