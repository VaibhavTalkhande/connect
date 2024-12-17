import EventList from "@/components/EventList";
import MyDatePicker from "@/components/MyDatePicker";
import { PenBoxIcon } from "lucide-react";
import Link from "next/link";
const page = () => {
  return (
    <div className="flex flex-1 h-full w-full flex-wrap">
      <div className="flex justify-end items-start ">
        <Link
          href="/events?create=true"
          className="text-white py-2 h-16 flex items-center hover:bg-green-600 px-4 rounded-xl bg-slate-900 border-none "
        >
          <PenBoxIcon className="mr-2 h-5 w-5 inline-block" />
          <h2 className="inline-block">Create Event</h2>
        </Link>
        
      </div>
      <div className="relative flex justify-center item-start w-full border-2 border-black">
        <div className="absolute inset-0 top-0 left-0 w-full h-full bg-slate-900 opacity-50 z-0"></div>
        <EventList />
      </div>
    </div>
  );
};

export default page;
