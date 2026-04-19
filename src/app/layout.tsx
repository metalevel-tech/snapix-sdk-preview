import { type Metadata, type Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ThemeHotkey from "@/components/theme/ThemeHotkey";
import { Toaster } from "@/components/ui/sonner";
import {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_NAME,
  BASE_URL,
  META_DESCRIPTION,
  META_TITLE,
  OG_IMAGE,
  OG_IMAGE_ALT,
} from "@/constants";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@wrksz/themes/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#18181b" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: BASE_URL,
    siteName: APP_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: APP_NAME,
  authors: [{ name: APP_AUTHOR, url: APP_AUTHOR_URL }],
  keywords: [
    "snapix",
    "image sdk",
    "image gallery",
    "image upload",
    "image storage",
    "sdk demo",
    "sdk preview",
  ],
  icons: {
    icon: { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/icons/apple-touch-icon-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
      lang="en"
    >
      <body>
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          <ThemeHotkey />
          <div className="flex min-h-svh p-6 max-w-4xl">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
