import { getDictionaries, getDictionary, Locale } from "@/lib/dictionaries";
import { ProfileSidebar } from "../../ProfileSideBar";
import { ProfileAvatar } from "../../ProfileAvatar";
import { ProfileMobileDrawer } from "../../ProfileMobileDrawer";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;
  const { auth: authDict, user: userDict } = await getDictionaries(lang as Locale, ["auth", "user"]);

  return (
    <main className="bg-[#F9F9F9] min-h-screen">
      <div className="xl:container mx-auto px-5 py-6">
        <div className=" grid grid-cols-12 gap-6">
          <div className="col-span-12 flex justify-between items-center">
            <ProfileAvatar />
            <ProfileMobileDrawer lang={lang as Locale} dict={userDict} />
          </div>

          <aside className="hidden lg:block lg:col-span-3">
            <ProfileSidebar lang={lang as Locale} dict={userDict} />
          </aside>

          <section className="col-span-12 lg:col-span-9">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
