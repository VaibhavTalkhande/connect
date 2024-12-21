"use client";
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { Suspense, useEffect, useState } from "react";
import { getMentorDetails } from "../../../actions/user";
import { useParams, usePathname, useRouter  } from 'next/navigation';
import Link from "next/link";
import  {DayPicker}  from 'react-day-picker';
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import EventList from "@/components/EventList";

export type MentorDetails = {
    imageUrl?: string | null;
    username?: string | null;
    bio?: string | null;
    expertise?: string[] | null;
    socials?: {
        id: string;
        userId: string;
        platform: string | null;
        link: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[] | null;
    events?: {
        id: string;
        title: string;
        description: string | null;
        price: number;
        dateSlot: {
            id: string;
            date: Date;
            timeSlot: {
                id: string;
                time: Date;
                isBooked: boolean;
            }[];
        }[];
    }[] | null;
}
const Page = () => {
    const params = useParams();
    const pathname = usePathname();
    const [mentorDetails, setMentorDetails] = useState<MentorDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const fetchMentorDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                if (typeof params.mentor === 'string') {
                    const details = await getMentorDetails(params.mentor);
                    setMentorDetails(details);
                    console.log('Fetched mentor details:', details);
                } else {
                    setError('Invalid mentor ID');
                }
            } catch (err) {
                console.error('Error fetching mentor details:', err);
                setError('Failed to load mentor details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMentorDetails();
    }, [params.mentor]); // Only depend on params.mentor

    if (error) {
        return (
            <div className="relative text-white h-screen w-screen flex flex-col justify-center items-center">
                <Card className="z-10 p-6 bg-red-100">
                    <p className="text-red-600">{error}</p>
                </Card>
            </div>
        );
    }
    const redirectToEvent = (booking: string) => {
        router.push(`/${mentorDetails?.username}/${booking}`);
    }

    return (
        <div className="relative my-auto p-10 text-white min-h-screen w-screen flex flex-col  justify-center items-center gap-5">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <Card className="z-10 flex flex-col  border-teal-500 items-center p-6 bg-gray-800">
                    {isLoading ? (
                        <div className="text-white">Loading mentor details...</div>
                    ) : (
                        <div className="flex flex-col max-w-1/2 items-center gap-4">
                            <Image 
                                src={mentorDetails?.imageUrl || '/default.jpg'} 
                                alt={`${mentorDetails?.username || 'Mentor'}'s profile`} 
                                width={200} 
                                height={200} 
                                className="rounded-full object-cover"
                            />
                            <h1 className="text-2xl font-bold text-white">
                                {mentorDetails?.username || 'Loading...'}
                            </h1>
                            <p className="text-gray-300 text-center max-w-md">
                                {mentorDetails?.bio || 'No bio available'}
                            </p>
                            {mentorDetails?.socials && (
                                <div className="flex gap-4">
                                    {mentorDetails.socials.map((social) => (
                                        <Link key={social.id} href={String(social.link) || '#'} passHref>
                                            {social.platform==='LinkedIn' ? <LinkedInLogoIcon className="h-6 w-6 text-blue-500"/> : social.platform==='GitHub' ? <GitHubLogoIcon className="h-6 w-6 text-gray-500"/> : <TwitterLogoIcon className="h-6 w-6 text-blue-400"/>}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {mentorDetails?.expertise && (
                                <div className="flex gap-2">
                                    {mentorDetails.expertise.map((expertise) => (
                                        <span key={expertise} className="bg-teal-500 text-white p-1 rounded">{expertise}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </Suspense>
            
            <div className="mt-6 text-center flex flex-col gap-4">
                <h1 className="text-2xl font-bold mb-2">Booking Page</h1>
                <p className="text-gray-300">pathname: {pathname}</p>
                <p className="text-gray-300">userId: {params.mentor}</p>
                <div className="w-full flex justify-center items-center gap-4 flex-wrap">
                {mentorDetails?.events && (
                    mentorDetails.events.map((event) => (
                        <Card key={event.id} className=" relative w-[25%] h-[15em] flex flex-col gap-4 p-6  bg-gray-800">
                            <h2 className="text-xl font-bold">{event.title}</h2>
                            <p className="text-gray-300  p-1 text-wrap  text-ellipsis overflow-hidden  h-[60%] ">{event.description || 'No description available'}</p>
                            <p className="text-gray-300">Price: {event.price} Rs</p>

                                <button className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                                onClick={() => event.id && redirectToEvent(event.id.toString())}
                                >Book</button>
                        </Card>
                    ))
                )}
                </div>
            </div>
        </div>
    );
};

export default Page;