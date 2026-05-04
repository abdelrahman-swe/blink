import "server-only";

const dictionaries = {
  auth: {
    en: () =>
      import("@/dictionaries/en/auth.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/auth.json").then((module) => module.default),
  },
  footer: {
    en: () =>
      import("@/dictionaries/en/footer.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/footer.json").then((module) => module.default),
  },
  home: {
    en: () =>
      import("@/dictionaries/en/home.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/home.json").then((module) => module.default),
  },
  cart: {
    en: () =>
      import("@/dictionaries/en/cart.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/cart.json").then((module) => module.default),
  },
  checkout: {
    en: () =>
      import("@/dictionaries/en/checkout.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/checkout.json").then((module) => module.default),
  },
  product: {
    en: () =>
      import("@/dictionaries/en/product.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/product.json").then((module) => module.default),
  },
  user: {
    en: () =>
      import("@/dictionaries/en/user.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/user.json").then((module) => module.default),
  },
  returns: {
    en: () =>
      import("@/dictionaries/en/returns.json").then((module) => module.default),
    ar: () =>
      import("@/dictionaries/ar/returns.json").then((module) => module.default),
  },
};

type Namespace = keyof typeof dictionaries;

type Dictionary<N extends Namespace> = Awaited<ReturnType<typeof dictionaries[N]["en"]>>;

export async function getDictionary(locale: Locale, namespace: "auth"): Promise<Dictionary<"auth">>;
export async function getDictionary(locale: Locale, namespace: "footer"): Promise<Dictionary<"footer">>;
export async function getDictionary(locale: Locale, namespace: "home"): Promise<Dictionary<"home">>;
export async function getDictionary(locale: Locale, namespace: "cart"): Promise<Dictionary<"cart">>;
export async function getDictionary(locale: Locale, namespace: "checkout"): Promise<Dictionary<"checkout">>;
export async function getDictionary(locale: Locale, namespace: "product"): Promise<Dictionary<"product">>;
export async function getDictionary(locale: Locale, namespace: "user"): Promise<Dictionary<"user">>;
export async function getDictionary(locale: Locale, namespace: "returns"): Promise<Dictionary<"returns">>;
export async function getDictionary(locale: Locale, namespace: Namespace): Promise<Dictionary<Namespace>>;
export async function getDictionary(locale: Locale): Promise<Dictionary<"auth">>;
export async function getDictionary(
  locale: Locale,
  namespace: Namespace = "auth"
) {
  const namespaceDictionaries = dictionaries[namespace];

  if (!namespaceDictionaries || !namespaceDictionaries[locale]) {
    return namespaceDictionaries?.en?.();
  }

  return namespaceDictionaries[locale]();
}

import { Locale } from "@/utils/types/locale";

export const getDictionaries = async (
  locale: "en" | "ar",
  namespaces: Namespace[]
) => {
  const results: Record<string, any> = {};

  for (const namespace of namespaces) {
    results[namespace] = await getDictionary(locale, namespace);
  }

  return results;
};

export type { Locale };
export { locales, defaultLocale } from "@/utils/types/locale";

