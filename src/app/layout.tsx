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
  title: "Veyra - Social commerce Platform",
  description:
    "Where creators, users, and brands meet — powered by content, commerce, and community.",
  icons: {
    icon: "/logo.svg.png", // your new favicon path in public folder
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
