"use client"
import React, { useEffect } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { useRouter } from "next/navigation";



function Header() {
  const router = useRouter();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`/api/user`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          const user = data
          console.log(data);
          if (user && !user.role) { // If user exists but no role, redirect to onboarding
            console.log(user);
            router.push(`/onboarding?userId=${user.clerkUserId}`);
          }
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    };

    verifyUser();
  }, [router]);

  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          width="150"
          height="60"
          alt="Schedulrr Logo"
          className="h-16 w-auto"
        />
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/events?create=true">
          <Button variant="default" className="flex items-center gap-2">
            <PenBox size={18} />
            <span className="hidden sm:inline">Create Event</span>
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Header;
