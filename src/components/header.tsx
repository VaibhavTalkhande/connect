"use client"
import React, { useContext, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { useRouter } from "next/navigation";
import{ AuthContext} from "@/context/AuthContext";
import { Role } from "@/types/ModelTypes";




function Header() {
  const router = useRouter()
  const { user } = useContext(AuthContext);
  console.log(user)
  useEffect(
    () => {
      if (user) {
        if (user.role === Role.MENTOR) {
          router.push("/dashboard/mentor");
        } else if (user.role === Role.MENTEE) {
          router.push("/dashboard/mentee");
        }
      }
    },
    [user]
 )
  return (
    <nav className="mx-auto my-auto py-4 px-4 flex justify-between bg-slate-950 items-center shadow-md ">
      <Link href="/" className="flex items-center">
        <h1 className="text-4xl font-extrabold font-sans text-pretty  text-blue-600">Connect</h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/events?create=true" passHref className="bg-red-100 border-2 rounded-md flex py-2 px-4 items-center">
            <PenBox className="mr-2" size={16} />
            Create Event
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
