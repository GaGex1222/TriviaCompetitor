import type { Metadata } from "next";
import { Varela_Round } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/Footer";

const varelaRound = Varela_Round({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-gradient-to-tr from-blue-500 to-indigo-600" lang="en">
      <SessionProvider>
        <body className={varelaRound.className}>
          <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
