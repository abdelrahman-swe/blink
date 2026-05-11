import type { Metadata } from "next";
import { getDictionaries, Locale } from "@/lib/dictionaries";
import { generateSeoMetadata } from "@/utils/seo";
import { getStaticPageSeo } from "@/utils/services/seo";
import ProfileAddress from "./components/ProfileAddress";
import ProfileInfo from "./components/ProfileInfo";

interface AccountPageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: AccountPageProps): Promise<Metadata> {
    const { lang } = await params;
    const seo = await getStaticPageSeo("account", lang);
    return generateSeoMetadata(seo, lang, { title: "Account | Blink", description: "Manage your Blink account" });
}

const ProfileAccount = async ({ params }: AccountPageProps) => {
    const { lang } = await params;
    const { auth: authDict, user: userDict } = await getDictionaries(lang, ["auth", "user"]);
    const accountDict = userDict?.profile?.account;

    return (
        <>
            <h2 className="text-xl font-semibold mb-3">{accountDict?.title}</h2>

            <section className="bg-background xl:container mx-auto p-5 rounded-2xl border border-gray-200">
                <ProfileInfo authDict={authDict} userDict={userDict} />
                <ProfileAddress authDict={authDict} userDict={userDict} />
            </section>
        </>
    );
}

export default ProfileAccount;