"use server"
import { MentorDetails } from "@/app/[mentor]/page";
import { db } from "@/lib/prisma";


export const getMentorDetails = async(username: string):Promise<MentorDetails |null> => {
        const user = await db.user.findUnique({
            where:{
                username,
            },
            include:{
                socials:true,
                events:{
                    select:{
                        id:true,
                        title:true,
                        description:true,
                        price:true,
                        dateSlot:{
                            select:{
                                id:true,
                                date:true,
                                timeSlot:{
                                    select:{
                                        id:true,
                                        time:true,
                                        isBooked:true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if(!user){
            return null;
        }
        return {
            imageUrl: user.imageUrl,
            username: user.username,
            bio: user.bio,
            socials: user.socials,
            expertise: user.expertise,
            events: user.events
        };
}
