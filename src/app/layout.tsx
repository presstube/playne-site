import type { Metadata } from "next";
import RootLayout from './RootLayout/RootLayout'
import "./globals.css";

export const metadata: Metadata = {
  title: "PLAYNE",
  description: "Empowering young minds through practical life education",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
