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
            className={`${inter.className} antialiased text-gray-900 dark:text-gray-100`}
          >
            {/* <Header/> */}
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-blue-800 to-slate-900 dark:from-gray-900 dark:to-gray-800">
              {children}
            </main>
            <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-12 bg-slate-900 dark:bg-gray-800">
              <div className="py-4 container mx-auto px-4 text-center">
                <p>Made with ❤️ </p>
              </div>
            </footer>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
