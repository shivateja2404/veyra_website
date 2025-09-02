import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
 
import { RootProviders } from "@/components/RootProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veyra - Discover, Share, and Shop Your Style",
  description:
    "Where creators, users, and brands meet — powered by content, commerce, and community. Join the social commerce revolution with Veyra.",
  icons: { icon: "/logo.svg.png" },
  openGraph: {
    title: "Veyra - Discover, Share, and Shop Your Style",
    description:
      "Where creators, users, and brands meet — powered by content, commerce, and community. Join the social commerce revolution with Veyra.",
    url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL || "www.veyra.co.in"}`,
    siteName: "Veyra",
    images: [
      {
        url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL || "www.veyra.co.in"}/preview_image.jpg`,
        width: 1200,
        height: 630,
        alt: "Veyra - Social Commerce Platform",
        type: "image/jpeg",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@veyra",
    creator: "@veyra",
    title: "Veyra - Discover, Share, and Shop Your Style",
    description:
      "Where creators, users, and brands meet — powered by content, commerce, and community.",
    images: [
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL || "www.veyra.co.in"}/preview_image.jpg`,
    ],
  },
  themeColor: "#6366F1",
  applicationName: "Veyra",
  appleWebApp: {
    capable: true,
    title: "Veyra",
    statusBarStyle: "default",
  },
};


 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <RootProviders>
          {children}
         </RootProviders>
      </body>
    </html>
  );
}
