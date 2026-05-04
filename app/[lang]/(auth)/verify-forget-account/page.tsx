import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/dictionaries';
import VerifyForgetAccountForm from './VerifyForgetAccountForm';

export default async function VerifyForgetAccountPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return (
        <VerifyForgetAccountForm lang={lang} />
    );
}
