"use client"
import React, { useContext, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUp, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import UserMenu from "./user-menu";

import { useRouter } from "next/navigation";
import{ AuthContext} from "@/context/AuthContext";
import { Role } from "@/types/ModelTypes";
import { DashboardIcon } from "@radix-ui/react-icons";
import { checkUser } from "@/lib/checkUser";




function Header() {
  const router = useRouter()
  const { user } = useContext(AuthContext);
  useEffect(
    () => {
      if (user) {
        console.log(user);
        if (user.role === Role.MENTOR) {
          router.push("/dashboard/");
        } else if (user.role === Role.MENTEE) {
          router.push("/dashboard/mentee");
        }
      }
    },
    [user,router]
 )
  return (
    <nav className=" mx-auto  w-full my-auto py-4 px-4 flex justify-between rounded-lg  bg-black  border-b-2 border-b-teal-400 border-bottom-black items-center">
      <Link href="/" className="flex items-center">
        <h1 className="text-4xl font-extrabold font-sans text-pretty  text-teal-500">
          Connect
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton forceRedirectUrl="/">
            <button className="text-teal-500 font-semibold rounded-2xl px-4 py-2 border-2 border-teal-500">Login</button>
          </SignInButton>
          <SignUpButton forceRedirectUrl={"/onboarding"}>
            <button className="text-teal-500 font-semibold rounded-2xl px-4 py-2 border-2 border-teal-500">Sign Up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
        <Link
          href="/dashboard"
          passHref
          className="font-semibold text-teal-400 border-teal-400 border-2 rounded-[0.5rem] flex py-2 px-4 items-center"
        >

          <DashboardIcon className="mr-2 h-5 w-5" />
            DashBoard
        </Link>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Header;
