import type { Metadata } from "next";
import { Varela_Round } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import "./globals.css";

const varelaRound = Varela_Round({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Trivia Competitors",
  description: "Generated by create next app",
  icons: {
    icon: 'https://trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com/image-removebg-preview.png'
  }
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
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}

