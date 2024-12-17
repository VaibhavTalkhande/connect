import {
  ClerkProvider
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

import AuthProvider from "@/context/AuthContext";

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
            className={`${inter.className} dark:bg-gray-900 dark:text-gray-100`}
          >
            {/* <Header/> */}
            <Header />
            <main className="h-screen bg-gradient-to-br  from-teal-400 via-teal-500 to-teal-600  overflow-hidden">
              {children}
            </main>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
