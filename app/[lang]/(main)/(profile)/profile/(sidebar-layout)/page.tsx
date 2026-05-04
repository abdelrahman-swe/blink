import { redirect } from "next/navigation";
import { Locale } from "@/utils/types/locale";

interface ProfileProps {
    params: Promise<{ lang: Locale }>;
}

const Profile = async ({ params }: ProfileProps) => {
    const { lang } = await params;
    redirect(`/${lang}/profile/account`);
};

export default Profile;