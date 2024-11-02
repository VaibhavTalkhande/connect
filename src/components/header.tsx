import { SignedIn, SignedOut,SignInButton} from "@clerk/nextjs";
import { PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-black dark:text-white">
      <div className="container min-w-full mx-auto px-2">
        <div className="py-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">
            <Image
              src="/logo.png"
              alt="Connect"
              width={150}
              height={60}
              className="h-16 w-auto"
            />
          </Link>
          <div>
            <div className="flex space-x-4 items-center justify-center w-full">
                <Link href="/events?create=true">
                  <Button className="bg-slate-900 text-white hover:underline">
                    <PenBox size={18} /> create event
                  </Button>
                </Link>
              <div>
                <SignedOut>
                  <SignInButton forceRedirectUrl={"/dashboard"}>
                    <Button
                      variant="outline"
                      className=" text-black hover:underline w-[100px]"
                    >
                      Login
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserMenu/>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
