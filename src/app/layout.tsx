import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Şentürk Sıhhi Tesisat - Doğalgaz Hizmetleri",
    template: "%s | Şentürk Sıhhi Tesisat"
  },
  description: "Profesyonel doğalgaz tesisatı, su tesisatı, kalorifer tesisatı ve banyo tadilat hizmetleri. 20+ yıl tecrübe, uygun fiyat garantisi.",
  keywords: ["doğalgaz tesisatı", "su tesisatı", "kalorifer tesisatı", "banyo tadilat", "sıhhi tesisat", "Orhangazi"],
  authors: [{ name: "Şentürk Sıhhi Tesisat" }],
  creator: "Şentürk Sıhhi Tesisat",
  publisher: "Şentürk Sıhhi Tesisat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1f84d6",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.senturksihhitesisat.com",
    siteName: "Şentürk Sıhhi Tesisat",
    title: "Şentürk Sıhhi Tesisat - Doğalgaz Hizmetleri",
    description: "Profesyonel doğalgaz tesisatı, su tesisatı, kalorifer tesisatı ve banyo tadilat hizmetleri. 20+ yıl tecrübe, uygun fiyat garantisi.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Şentürk Sıhhi Tesisat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Şentürk Sıhhi Tesisat",
    description: "Profesyonel doğalgaz ve tesisat hizmetleri",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* <Topbar /> */}
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
