import type { Metadata } from "next";
import "./globals.css";
import { Schoolbell } from 'next/font/google';

const schoolbell = Schoolbell({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Topping Timer 🍰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={schoolbell.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
