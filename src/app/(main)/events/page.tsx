
import EventList from "@/components/EventList";
import { PenBoxIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
export const metadata:Metadata = {
  title: "Events",
  description: "Events",
};
const page = () => {
  return (
    <div className="flex flex-1 min-h-screen h-full w-full flex-wrap">
      <div className="flex justify-end items-start ">
        <Link
          href="/events?create=true"
          className="text-white py-2 border-2 border-white flex items-center hover:bg-green-600 px-4 rounded-xl bg-slate-900 font-semibold"
        >
          <PenBoxIcon className="mr-2 h-5 w-5 inline-block" />
          <h2 className="inline-block">Create</h2>
        </Link>
        
      </div>
      <div className="relative flex justify-center item-start h-full w-full">
        <Suspense fallback={<div>Loading...</div>}>
        <EventList />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
