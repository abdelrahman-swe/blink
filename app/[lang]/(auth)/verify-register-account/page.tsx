import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/dictionaries';
import VerifyRegisterAccountForm from './VerifyRegisterAccountForm';

export default async function VerifyRegisterAccountPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return (
        <VerifyRegisterAccountForm lang={lang} />
    );
}
