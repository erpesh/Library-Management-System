import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FacebookIcon, InstagramIcon, LibraryIcon, TwitterIcon, Heart, HomeIcon, PlusCircleIcon, FilmIcon, PhoneIcon, NotebookTabs } from 'lucide-react';
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { NextAuthProvider, ThemeProvider } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cantor Library",
  description: "Your personal media library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NextAuthProvider>
            <Header />
            <main className="mx-auto max-w-[1200px] min-h-page px-4">
              {children}
            </main>
            <Footer />
            <Toaster />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}