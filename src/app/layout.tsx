'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import SessionWrapper from "@/components/SessionWrapper";
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { ContactProvider } from '@/context/ContactContext';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <ContactProvider>
            <SessionWrapper>
              <Providers>
                <div className="flex flex-col min-h-screen">
                  {!isAdminPage && <Header />}
                  <main className="flex-1">
                    {children}
                  </main>
                  {!isAdminPage && <Footer />}
                </div>
              </Providers>
            </SessionWrapper>
          </ContactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}