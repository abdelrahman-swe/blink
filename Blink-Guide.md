# 🔁 BLINK — Full Developer Handover Guide

---

## 🔗 Key Resources — Open These First

> These three links are everything you need before touching any code.

| Resource | Link | What it is |
|---|---|---|
| 🌐 **Live Site** | [blink-code-clouders.netlify.app](https://blink-code-clouders.netlify.app/en/home) | The deployed production app. Use this to understand how the app looks and works before reading any code |
| 🎨 **Figma Design** | [B-marketplace on Figma](https://www.figma.com/design/BG0OyXkTlo97SUCntf3rfL/B-marketplace?m=auto&t=3EuNp8Gn75xuIS77-6) | The original UI/UX design file. Every screen, component, and color is here — reference this when building or modifying any UI |
| 📡 **API Documentation** | [Postman Docs](https://documenter.getpostman.com/view/48848211/2sB3WtrdtV#e7615e87-a75a-4b36-8d1c-458aa8c6d703) | Full backend API reference. Every endpoint, request body, and response shape is documented here — always check this before writing a new API call |

> [!IMPORTANT]
> Always compare what you see in the **Live Site** vs **Figma** before changing any UI — some things may be intentionally different from the design due to backend limitations or client decisions.

> [!TIP]
> The **Postman Docs** also include example responses. Use them to understand the shape of data before writing TypeScript types in `utils/types/`.

---

## 1. What Is This Project?

**BLINK** is a **Next.js 16 e-commerce frontend** (React 19 + TypeScript + TailwindCSS v4).
It is a **frontend-only** project. The backend is a separate **Laravel REST API**:
```
Base URL: https://blink.appclouders.com/api
```
The app is fully bilingual: **English (LTR)** and **Arabic (RTL)**.

---

## 2. Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 16 (App Router) | Routing, SSR, layouts |
| React 19 + TypeScript | UI + type safety |
| TailwindCSS v4 | Styling |
| Zustand | Global client state (user session, theme, loading) |
| TanStack Query v5 | All API calls, caching, mutations |
| Axios | HTTP client (with interceptors) |
| React Hook Form + Zod v4 | All forms and validation |
| Radix UI | Accessible UI primitives (Dialog, Select, Popover…) |
| Swiper | Category header carousel |
| Embla Carousel | Home page product carousels |
| next-themes | Dark/light mode |
| js-cookie | Cookie read/write |
| Sonner | Toast notifications |
| yet-another-react-lightbox | Product image lightbox |
| HugeIcons | Icon library |

---

## 3. Folder Structure

```
blink/
├── app/                        ← Next.js App Router root
│   ├── globals.css             ← Global styles + CSS variables
│   ├── layout.tsx              ← Root HTML shell
│   ├── error.tsx               ← Global error boundary
│   ├── not-found.tsx           ← Custom 404 page
│   └── [lang]/                 ← ALL pages (locale: "en" | "ar")
│       ├── layout.tsx          ← Sets lang + dir on <html>
│       ├── providers/          ← QueryClient, Toaster, DictionaryProvider
│       ├── (auth)/             ← Login, Register, OTP, Forgot Password
│       ├── (payment)/          ← Payment success/failure pages
│       └── (main)/             ← Main site with Header+Footer
│           ├── layout.tsx      ← Wraps NavBar + Header + Footer
│           ├── home/           ← Homepage
│           ├── cart/           ← Cart page
│           ├── checkout/       ← Checkout page
│           ├── search-result/  ← Search results
│           ├── (dynamic)/      ← Product, Category, Brand pages
│           ├── (profile)/      ← Profile area (protected)
│           ├── (legal)/        ← Privacy, Terms, Contact, Returns
│           └── (static)/       ← Other static info pages
│
├── components/
│   ├── layout/                 ← NavBar, Header, Footer, MegaDropdown
│   ├── common/                 ← ProductCard, CategoryFilters, PaymentSummary…
│   ├── auth/                   ← AuthorizedUser, NotAuthorizedUser
│   ├── home/                   ← Hero, Deals, NewArrivals, BestSelling, Brand…
│   ├── ui/                     ← Base design system (Button, Input, Dialog…)
│   ├── skeleton/               ← Skeleton loaders
│   ├── loading/                ← Spinner components
│   ├── providers/              ← DictionaryProvider, ThemeProvider
│   └── settings/               ← LanguageSwitcher, ThemeSwitcher
│
├── hooks/
│   ├── queries/                ← ALL TanStack Query hooks (one file per domain)
│   ├── useAppRouter.ts         ← locale-aware router (use instead of useRouter)
│   ├── useLocale.ts            ← get lang + dictionary
│   ├── useProductFilters.ts    ← filter state via URL params
│   ├── useRequireAuth.ts       ← redirect to login if unauthenticated
│   ├── useOrderSummary.ts      ← cart totals calculation
│   └── useOtpResendLimiter.ts  ← OTP cooldown timer
│
├── store/
│   ├── useUserStore.ts         ← Auth state + cookie sync
│   ├── themeStore.ts           ← Dark/light theme
│   └── useLoadingStore.ts      ← Global top loading bar
│
├── utils/
│   ├── api.ts                  ← Axios instance with interceptors
│   ├── types/                  ← TypeScript interfaces (Product, User, Order…)
│   └── services/               ← Raw API call functions (used by query hooks)
│
├── lib/
│   ├── config.ts               ← API base URLs
│   ├── dictionaries.ts         ← Translation loader
│   └── utils.ts                ← cn() class merger
│
├── dictionaries/               ← en.json, ar.json (all UI strings)
├── middleware.ts               ← i18n redirect + route protection
└── .env.local                  ← API URLs (not in git — ask for this file)
```

---

## 4. Every Page — Features + Components

### 🏠 Home Page
**Route:** `/[lang]/home`
**File:** `app/[lang]/(main)/home/page.tsx`

**What it does:** The main landing page. Loads all sections from the API.

**Components used (in order):**
| Component | File | What it does |
|---|---|---|
| `Hero` | `components/home/Hero.tsx` | Full-width banner slider. Fetches banners from API. Used twice — once for position 0, once for position 1 (between sections) |
| `Pros` | `components/home/Pros.tsx` | "Why shop with us" icons row (free shipping, returns, etc.) |
| `Deals` | `components/home/Deals.tsx` | Flash deals section with countdown timer per product |
| `NewArrivals` | `components/home/NewArrivals.tsx` | Horizontal scrollable new product carousel |
| `BestSelling` | `components/home/BestSelling.tsx` | Best-selling products carousel |
| `Brand` | `components/home/Brand.tsx` | Brand logos carousel — clicking goes to brand page |
| `Explore` | `components/home/Explore.tsx` | "Explore categories" grid section |

**API Hook:** `hooks/queries/useHomeQueries.ts`

---

### 🧭 NavBar (shown on ALL main pages)
**File:** `components/layout/NavBar.tsx`

**Features:**
- Logo → links to home
- Search bar with **live suggestions** (300ms debounce, keyboard arrow navigation)
- Cart icon with **live item count badge**
- Language switcher
- **If logged in:** shows `AuthorizedUser` component (avatar dropdown with profile, favourites, logout)
- **If guest:** shows `NotAuthorizedUser` component (Login + Sign Up buttons)
- **Mobile:** Hamburger menu opens a right-side `Drawer` with same nav links
- Calls `syncWithCookies()` on mount to restore session from cookies
- Calls `useTokenRefresh()` to keep token alive

**Auth components inside NavBar:**
| Component | File | What it shows |
|---|---|---|
| `AuthorizedUser` | `components/auth/AuthorizedUser.tsx` | Avatar + dropdown: Profile, Favourites, Logout |
| `NotAuthorizedUser` | `components/auth/NotAuthorizedUser.tsx` | Login button + Sign Up button |

---

### 📂 Category Header (shown on ALL main pages below NavBar)
**File:** `components/layout/Header.tsx`

**Features:**
- Horizontal Swiper of category links fetched from API
- Left/right navigation arrows that **disable at edges**
- Hovering a category with children opens a **MegaDropdown** (portal-based)
- MegaDropdown shows subcategories + top brands for that category

**Related:** `components/layout/MegaDropdownPortal.tsx`

---

### 🛍️ Product Detail Page
**Route:** `/[lang]/product/[slug]`
**File:** `app/[lang]/(main)/(dynamic)/product/[slug]/page.tsx`

**Features:** Full product page — gallery, info, specs, reviews

**Components:**
| Component | File | What it does |
|---|---|---|
| `ProductGallery` | `…/components/details/ProductGallery.tsx` | Image gallery with prev/next nav + lightbox on click. Arrows stop propagation to prevent lightbox on nav click |
| `ProductInfo` | `…/components/details/ProductInfo.tsx` | Name, price, discount, add to cart, add to favourites, stock status |
| `DetailsSection` | `…/components/details/DetailsSection.tsx` | HTML product description (rendered safely) |
| `SpecificationSection` | `…/components/details/SpecificationSection.tsx` | Specs table (key-value pairs) |
| `ProductRatingAndReviews` | `…/components/common/ProductRatingAndReviews.tsx` | Overall star rating + breakdown bars |
| `ReviewSection` | `…/components/Reviews/ReviewSection.tsx` | List of all reviews paginated |
| `ReviewCard` | `…/components/Reviews/ReviewCard.tsx` | Single review (author, stars, text, images, likes) |
| `WriteReviewPrompt` | `…/components/Reviews/WriteReviewPrompt.tsx` | "Write a Review" button — hidden if guest or ineligible, disabled if already reviewed |
| `RatingAndReviewsForm` | `…/components/common/RatingAndReviewsForm.tsx` | Star picker + text + image upload form |

**API Hook:** `hooks/queries/useProductQueries.ts`

---

### 🗂️ Category Page
**Route:** `/[lang]/category/[slug]`
**File:** `app/[lang]/(main)/(dynamic)/category/[slug]/page.tsx`

**Features:** Product listing with filters, sorting, pagination

**Components:**
| Component | File | What it does |
|---|---|---|
| `CategoryFilters` | `components/common/CategoryFilters.tsx` | Sidebar: price range slider, brand checkboxes, sub-category checkboxes. Merges selected items with API "top" list so selected items always appear |
| `CategoryFiltersWrapper` | `components/common/CategoryFiltersWrapper.tsx` | Mobile-friendly drawer wrapper for filters |
| `ProductCard` | `components/common/ProductCard.tsx` | Grid of product cards (see below) |
| `ProductSorting` | `components/common/ProductSorting.tsx` | Sort dropdown (price asc/desc, newest…) |
| `CategoryPagination` | `components/common/CategoryPagination.tsx` | Page number pagination |
| `EmptyProduct` | `…/category/components/EmptyProduct.tsx` | Empty state when no products match filters |

**Filter State:** All filters live in URL search params — managed by `hooks/useProductFilters.ts`

**API Hook:** `hooks/queries/useCategoryQueries.ts`

---

### 🏷️ Brand Page
**Route:** `/[lang]/brand/[slug]`
**File:** `app/[lang]/(main)/(dynamic)/brand/[slug]/page.tsx`

Same layout as Category page (filters + product grid + pagination). Uses `hooks/queries/useBrandQueries.ts`

---

### 🔍 Search Results Page
**Route:** `/[lang]/search-result?query=...`
**File:** `app/[lang]/(main)/search-result/page.tsx`

**Features:** Same filter+grid layout as category. Query comes from URL param `?query=`.
**API Hook:** `hooks/queries/useSearchQueries.ts`

---

### 🛒 Cart Page
**Route:** `/[lang]/cart`
**File:** `app/[lang]/(main)/cart/page.tsx`

**Features:** View and manage cart items, apply coupon, see order summary, proceed to checkout

**Components:**
| Component | File | What it does |
|---|---|---|
| `CartProducts` | `…/cart/components/CartProducts.tsx` | List of cart items with quantity +/- and remove button |
| `CartRemoveAllDialog` | `…/cart/components/CartRemoveAllDialog.tsx` | Confirmation dialog before clearing entire cart |
| `EmptyCart` | `…/cart/components/EmptyCart.tsx` | Empty state illustration + "Go Shopping" button |
| `PaymentSummary` | `components/common/PaymentSummary.tsx` | Order total, discount, coupon field, checkout button — reused on both Cart and Checkout pages |

**API Hook:** `hooks/queries/useCartQueries.ts`

---

### 💳 Checkout Page
**Route:** `/[lang]/checkout`
**File:** `app/[lang]/(main)/checkout/page.tsx`

**Features:** Address form, payment method selection, order summary, place order. Works for both **logged-in** and **guest** users. Guest form data saved to `localStorage` as `checkout_form_data`.

**Components:**
| Component | File | What it does |
|---|---|---|
| `CheckoutForm` | `…/checkout/components/CheckoutForm.tsx` | Main form: name, phone, address, city, country. Pre-fills from user profile if logged in |
| `CheckoutFormInput` | `…/checkout/components/CheckoutFormInput.tsx` | Reusable labeled input field |
| `CheckoutFormSelect` | `…/checkout/components/CheckoutFormSelect.tsx` | Reusable labeled select (country/city dropdowns) |
| `CheckoutPaymentOption` | `…/checkout/components/CheckoutPaymentOption.tsx` | Radio buttons for payment method (COD / Online) |
| `PaymentStatusDialog` | `…/checkout/components/PaymentStatusDialog.tsx` | Dialog shown after payment attempt (success or failure) |
| `PaymentSummary` | `components/common/PaymentSummary.tsx` | Order total sidebar |

**API Hook:** `hooks/queries/useCheckoutQueries.ts`

---

### 💰 Payment Result Pages
**Route:** `/[lang]/payment/...`
**File:** `app/[lang]/(payment)/payment/page.tsx`

Shown after online payment redirect. Handles success and failure states from the payment gateway callback.

---

### 👤 Profile Area (Protected — requires login)
**Route:** `/[lang]/profile/...`
**Middleware:** Redirects to `/[lang]/login?callbackUrl=...` if no token cookie

#### Profile / Account Settings
**Route:** `/[lang]/profile/account`

| Component | File | What it does |
|---|---|---|
| `ProfileInfo` | `…/account/components/ProfileInfo.tsx` | Edit name, email. Trigger phone verification |
| `ProfileAddress` | `…/account/components/ProfileAddress.tsx` | Add/edit/delete saved delivery addresses |
| `VerifyProfilePhoneDialog` | `…/account/components/VerifyProfilePhoneDialog.tsx` | OTP dialog to verify new phone number |

#### Orders
**Route:** `/[lang]/profile/orders`
**File:** `app/[lang]/(profile)/profile/(sidebar-layout)/orders/page.tsx`
Shows full order history with status, items, and tracking.

#### Returns
**Route:** `/[lang]/profile/returns`
**File:** `app/[lang]/(profile)/profile/(sidebar-layout)/returns/page.tsx`
Shows return requests submitted by the user.

#### Favourites / Wishlist
**Route:** `/[lang]/profile/favourite`
**File:** `app/[lang]/(profile)/profile/(sidebar-layout)/favourite/page.tsx`
Grid of saved favourite products. Uses `useToggleUserFavorites` to add/remove.

#### Security Settings
**Route:** `/[lang]/profile/security-settings`

| Component | File | What it does |
|---|---|---|
| `ChangePasswordDialog` | `…/security-settings/components/ChangePasswordDialog.tsx` | Old password → new password flow |
| `SignOutDialog` | `…/security-settings/components/SignOutDialog.tsx` | Logout confirmation |
| `DeleteAccountDialog` | `…/security-settings/components/DeleteAccountDialog.tsx` | Permanently delete account with OTP confirmation |

**Profile sidebar (shared layout):**
| Component | File | What it does |
|---|---|---|
| `ProfileSideBar` | `…/(profile)/ProfileSideBar.tsx` | Left nav: Account, Orders, Returns, Favourites, Security |
| `ProfileAvatar` | `…/(profile)/ProfileAvatar.tsx` | User avatar + name display |
| `ProfileMobileDrawer` | `…/(profile)/ProfileMobileDrawer.tsx` | Mobile version of sidebar as a bottom drawer |

---

### 🔐 Auth Pages
**Route group:** `app/[lang]/(auth)/`

| Route | Page | What it does |
|---|---|---|
| `/login` | Login | Phone + password form |
| `/register` | Register | Name, email, phone, password. Saves data to `sessionStorage` until OTP verified |
| `/verify-register-account` | OTP Verify (Register) | 6-digit OTP input with resend cooldown (useOtpResendLimiter) |
| `/forget-password` | Forgot Password | Enter phone to receive OTP |
| `/verify-forget-account` | OTP Verify (Forgot PW) | OTP input for password reset flow |
| `/reset-password` | Reset Password | New password entry |
| `/successfully-changed` | Success Screen | Shown after successful password reset |

**Auth hooks:** `hooks/queries/useAuthQueries.ts`

---

### 📄 Legal Pages
**Route group:** `app/[lang]/(main)/(legal)/`

| Route | Content |
|---|---|
| `/privacy-policy` | Privacy Policy (fetched from API as HTML) |
| `/terms-conditions` | Terms & Conditions |
| `/return-refund` | Return & Refund Policy |
| `/contact-us` | Contact form or info |

**API Hook:** `hooks/queries/useLegalQueries.ts`

---

## 5. The ProductCard Component (Most Reused Component)

**File:** `components/common/ProductCard.tsx`

Used on: Home, Category, Brand, Search, Favourites pages.

**What it does:**
- Renders a responsive grid of products (3 or 4 columns via `columns` prop)
- Shows image, name, price (regular / sale / deal), star rating, review count
- Shows discount badge (e.g. "20% Off")
- **Favourite button:** appears on hover. If guest → opens `LoginRequiredDialog`. If logged in → calls `useToggleUserFavorites`
- **Add to Cart button:** shows loading spinner per-product using `pendingProductId` state. On success → shows a confirmation `Dialog` with "Continue Shopping" / "View Cart" options
- **Prefetch on hover:** hovers over a card prefetch the product detail page data (50ms delay) for instant navigation

---

## 6. The Axios API Instance

**File:** `utils/api.ts`

All API calls go through this configured Axios instance. It automatically:
1. Adds `X-Locale` header (en/ar) from URL or cookie
2. Adds `X-Guest-Id` header (random UUID stored in cookie) for guest cart tracking
3. Adds `Authorization: Bearer <token>` for authenticated requests
4. Injects `token` into request body for endpoints that need it
5. On **401 response** → auto-clears cookies and redirects to home

**Never create a new axios instance** — always import `api` from `utils/api.ts`.

---

## 7. How to Add a New Feature

### New Page
1. Create folder in `app/[lang]/(main)/your-page-name/`
2. Add `page.tsx` inside
3. If it needs Header+Footer, it inherits from `(main)/layout.tsx` automatically

### New API Call
1. Add the raw function to `utils/services/yourDomain.ts`
2. Add the TanStack Query hook to `hooks/queries/useYourDomainQueries.ts`
3. Use the hook in your component

### New Translation String
1. Add the key to `dictionaries/en.json`
2. Add Arabic translation to `dictionaries/ar.json`
3. Access via `const { yourSection } = useDictionary()`

### New Protected Page
Add the path to `protectedPaths` array in `middleware.ts`:
```typescript
const protectedPaths = ['/profile', '/favorite', '/your-new-path'];
```

---

## 8. Environment Setup

```bash
git clone <repo-url>
cd blink
npm install
```

Create `.env.local` (ask previous dev for values):
```env
NEXT_PUBLIC_API_URL=https://blink.appclouders.com
BACKEND_URL=https://blink.appclouders.com
```

Run locally:
```bash
npm run dev   # http://localhost:3000 → auto-redirects to /en/home
```

Deployed on **Netlify** — see `netlify.toml`. Env vars must also be set in Netlify dashboard.

---

## 9. Critical Rules to Never Break

1. **Never use `useRouter()` from Next.js directly** → use `useAppRouter()` from `hooks/useAppRouter.ts` (it adds the `/[lang]/` prefix automatically)
2. **Never call axios directly in a component** → use a TanStack Query hook from `hooks/queries/`
3. **Always test in both EN and AR** — Arabic is RTL and some layouts flip
4. **Never store the auth token in localStorage** — it lives in cookies only (`useUserStore` mirrors it to Zustand for components)
5. **Never clear `checkout_form_data` from localStorage on login** — guest checkout data must survive the registration-during-checkout flow

---

## 10. Handover Conversation Plan

### Step 1 — Big Picture (30 min)
- "This is a Next.js frontend that talks to a Laravel API at `blink.appclouders.com`"
- Open the live app together — walk through: Home → Product → Cart → Checkout → Login → Profile
- Show it in Arabic too (change language in navbar)
- Run `npm run dev` locally together

### Step 2 — Code Walkthrough (1 hour)
Walk in this order:
1. `middleware.ts` → "this controls all routing and auth protection"
2. `utils/api.ts` → "every API call goes through here"
3. `store/useUserStore.ts` → "this is how auth state works — cookie + Zustand"
4. `hooks/queries/useCartQueries.ts` + `ProductCard.tsx` → show a full feature end-to-end
5. `components/layout/NavBar.tsx` → "this is the most complex component"
6. `hooks/useProductFilters.ts` → "filters live in the URL, not in React state"

### Step 3 — Handoff Checklist (20 min)
- [ ] Share `.env.local` values securely (NOT via chat/email)
- [ ] Add them to Git repo as collaborator
- [ ] Add them to Netlify dashboard
- [ ] Share backend API docs or Postman collection (if it exists)
- [ ] Share Figma/design files (if they exist)
- [ ] Explain current open bugs or incomplete features

### Common Questions They Will Ask
| Question | Answer |
|---|---|
| "How do I navigate to a page?" | `const router = useAppRouter(); router.push('/cart')` |
| "How do I know if user is logged in?" | `const { isAuthenticated } = useUserStore()` |
| "Where do I add a new API call?" | `utils/services/` then `hooks/queries/` |
| "Where do I add a new page?" | `app/[lang]/(main)/your-page/page.tsx` |
| "How do I show a toast?" | `import { toast } from 'sonner'; toast.success('Done!')` |
| "Where are the UI strings?" | `dictionaries/en.json` and `ar.json` |
| "How do I add a new protected route?" | Add path to `protectedPaths` in `middleware.ts` |
| "Why does the URL have /en/ in it?" | i18n — `middleware.ts` adds locale prefix to every route |
