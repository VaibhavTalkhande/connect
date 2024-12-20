"use client"
import React, { useContext, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import UserMenu from "./user-menu";

import { useRouter } from "next/navigation";
import{ AuthContext} from "@/context/AuthContext";
import { Role } from "@/types/ModelTypes";
import { DashboardIcon } from "@radix-ui/react-icons";





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
    [user,router]
 )
  return (
    <nav className=" mx-auto fixed top-0  z-10 w-full my-auto py-4 px-4 flex justify-between rounded-lg  bg-black  border-bottom-black items-center">
      <Link href="/" className="flex items-center">
        <h1 className="text-4xl font-extrabold font-sans text-pretty  text-teal-500">
          Connect
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          passHref
          className="bg-slate-900 font-semibold text-white border-2 rounded-[0.5rem] flex py-2 px-4 items-center"
        >
          <DashboardIcon className="mr-2 h-5 w-5" />
            DashBoard
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <button className="text-slate-950 font-semibold rounded-md px-4 py-2 border-2 border-slate-950">Login</button>
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
