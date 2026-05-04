import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NavBar from "@/components/layout/NavBar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { getDictionary, Locale } from "@/lib/dictionaries";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { DictionaryProvider } from "@/components/providers/DictionaryProvider";

type MainLayoutProps = {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
};

export default async function MainLayout({
  children,
  params,
}: MainLayoutProps) {
  const { lang } = (await params) as { lang: Locale };
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const initialIsAuthenticated = !!token;
  
  const footerDict = await getDictionary(lang, "footer");
  const homeDict = await getDictionary(lang, "home");
  const checkoutDict = await getDictionary(lang, "checkout");
  const cartDict = await getDictionary(lang, "cart");
  const productDict = await getDictionary(lang, "product");
  const authDict = await getDictionary(lang, "auth");
  const userDict = await getDictionary(lang, "user");
  const returnsDict = await getDictionary(lang, "returns");

  return (
    <DictionaryProvider dictionaries={{
      home: homeDict,
      footer: footerDict,
      checkout: checkoutDict,
      cart: cartDict,
      product: productDict,
      auth: authDict,
      user: userDict,
      returns: returnsDict
    }}>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <NavBar locale={lang} initialIsAuthenticated={initialIsAuthenticated} />
        <Header lang={lang} />
        <main className="grow">{children}</main>
        <Footer locale={lang} />
      </div>
    </DictionaryProvider>
  );
}
