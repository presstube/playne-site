import type { Metadata } from "next";
import RootLayout from './RootLayout/RootLayout'
import "./globals.css";

export const metadata: Metadata = {
  title: "PLAYNE",
  description: "Empowering young minds through practical life education. Founded by artist Shantell Martin, PLAYNE teaches real-life skills through creativity, helping young people understand their bodies, emotions, money, and voice.",
  keywords: ["PLAYNE", "Shantell Martin", "education", "life skills", "youth empowerment", "creativity", "practical education"],
  authors: [{ name: "PLAYNE" }],
  creator: "PLAYNE",
  publisher: "PLAYNE",
  metadataBase: new URL('https://playne.art'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://playne.art',
    siteName: 'PLAYNE',
    title: 'PLAYNE - Empowering Young Minds Through Practical Life Education',
    description: 'Founded by artist Shantell Martin, PLAYNE brings creativity into classrooms and community spaces to teach real-life skills. Helping young people understand their bodies, emotions, money, and voice.',
    images: [
      {
        url: '/social-card.jpg',
        width: 1200,
        height: 630,
        alt: 'PLAYNE - Empowering Young Minds',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PLAYNE - Empowering Young Minds Through Practical Life Education',
    description: 'Founded by artist Shantell Martin, PLAYNE brings creativity into classrooms and community spaces to teach real-life skills.',
    images: ['/social-card.jpg'],
    creator: '@shantell_martin',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
