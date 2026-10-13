import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { MotionProvider } from "@/components/motion-provider";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const newsreader = localFont({
  src: "../fonts/Newsreader-Variable.woff2",
  variable: "--font-newsreader",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Emmanuel G. Marquez",
    "Marketing Technology Specialist",
    "Salesforce Marketing Cloud",
    "Email Developer",
    "Journey Builder",
    "AMPscript",
    "CRM",
    "Lifecycle Marketing",
    "HTML Email",
    "Front-End Development",
    "Utah",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} | ${site.title}`,
    description: site.description,
    locale: "en_US",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${site.name}, ${site.title}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.title}`,
    description: site.description,
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#efefea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${newsreader.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
