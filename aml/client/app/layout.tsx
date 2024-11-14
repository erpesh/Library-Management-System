import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FacebookIcon, InstagramIcon, LibraryIcon, TwitterIcon, Heart, HomeIcon, PlusCircleIcon, FilmIcon, PhoneIcon, NotebookTabs } from 'lucide-react';
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

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
  title: "MediaLib",
  description: "Your personal media library",
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
        {/* <ThemeProvider */}
          {/* attribute="class" */}
          {/* defaultTheme="system" */}
          {/* enableSystem */}
          {/* disableTransitionOnChange */}
        {/* > */}
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <LibraryIcon className="w-6 h-6 text-primary" />
                  <span className="text-xl font-semibold">MediaLib</span>
                </div>
                <nav>
                  <ul className="flex space-x-6">
                    <li><Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><HomeIcon className="h-4 w-4" /> Home</Link></li>
                    <li><Link href="/media/add" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><PlusCircleIcon className="h-4 w-4" /> Add Media</Link></li>
                    <li><Link href="/media" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><FilmIcon className="h-4 w-4" /> Media</Link></li>
                    <li><Link href="/wishlist" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><Heart className="h-4 w-4" /> Wishlist</Link></li>
                    <li><Link href="/borrowing" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><NotebookTabs className="h-4 w-4" /> Borrowing</Link></li>
                    <li><Link href="/contact" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"><PhoneIcon className="h-4 w-4" /> Contact</Link></li>
                  </ul>
                </nav>
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-[1200px] min-h-screen px-4">
            {children}
          </main>
          <footer className="bg-secondary text-secondary-foreground mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p>&copy; 2024 MediaLib. All rights reserved.</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-primary transition-colors"><FacebookIcon className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><TwitterIcon className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><InstagramIcon className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </footer>
          <Toaster/>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}