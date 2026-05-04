import { getDictionaries, getDictionary, Locale } from "@/lib/dictionaries";
import ProfileAddress from "./components/ProfileAddress";
import ProfileInfo from "./components/ProfileInfo";

const ProfileAccount = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
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