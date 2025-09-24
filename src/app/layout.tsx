import type { Metadata } from "next";
import RootLayout from './RootLayout/RootLayout'
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Sanity Spike",
  description: "A Next.js project with Sanity CMS integration",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
