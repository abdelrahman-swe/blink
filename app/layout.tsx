// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./[lang]/providers/QueryProvider";
import NetworkStatusHandler from "@/components/common/NetworkStatusHandler";
import GlobalLoadingOverlay from "@/components/common/GlobalLoadingOverlay";
import { ThemeProvider } from "@/components/theme-provider";

const ibmPlexSans = localFont({
  src: [
    { path: "../public/fonts/IBMPlexSansArabic-Regular.ttf", weight: "400" },
    { path: "../public/fonts/IBMPlexSansArabic-Medium.ttf", weight: "500" },
    { path: "../public/fonts/IBMPlexSansArabic-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blink",
  description: "Where everything is blinking",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={ibmPlexSans.variable}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <NextTopLoader color="#0D0D0D" showSpinner={false} height={5} />
        <GlobalLoadingOverlay />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
            {/* <Toaster /> */}
            <NetworkStatusHandler />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
