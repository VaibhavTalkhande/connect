
import {
  ClerkProvider
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

import AuthProvider from "@/context/AuthContext";
import { checkUser } from "@/lib/checkUser";

export const metadata: Metadata = {
  title: "Connect",
  description: "Connect to expert",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="en">
          <body
            className={`${inter.className} dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200`}
          >
            {/* <Header/> */}
            <main className="relative h-full bg-repeat-round bg-gradient-to-br  from-teal-300 via-black to-teal-950  overflow-x-hidden">
            <Header />
              {children}
            </main>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
