import {
  ClerkProvider
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Connect",
  description: "meeting scheduling app",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} text-gray-900 bg-white dark:bg-black dark:text-white`}
        >
          {/* <Header/> */}
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-500 ">
            {children}
          </main>
          <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">
            <div className="py-4 container mx-auto px-4 text-center">
              <p>Made with ❤️ </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
