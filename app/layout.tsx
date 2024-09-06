import { GeistSans } from "geist/font/sans";
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Niclas Berger",
  description: "Software Engineer from Germany, passionate about building scalable, high-performance applications. Discover parts of my life here.",
  creator: "Niclas Berger",
  keywords: ["Software Engineer", "Open Source", "GISA GmbH", "Halle", "Germany", "Economics", "Niclas Berger"],
  twitter: {
    site: "@iambergerapi",
    card: "summary"
  },
  abstract: "Software Engineer from Germany, passionate about building scalable, high-performance applications. Discover parts of my life here.",
  icons: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎲</text></svg>",
  authors: [{
    name: "Niclas Berger",
    url: "https://niclas.lol",
  }],
  category: "Software Development",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://niclas.lol",
    title: "Niclas Berger",
    siteName: "Niclas Berger",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <div id="root" className="px-6 pt-32 text-slate-600 bg-gray-100 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
