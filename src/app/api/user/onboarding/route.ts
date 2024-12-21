import { db } from "@/lib/prisma";
import { SocialType } from "@/types/ModelTypes";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
req:NextRequest){
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
    
  }
  const body = await req.json();

  try {
    const userUpdate = await db.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        name: body.name ?? undefined,
        bio: body.bio ?? undefined,
        role: body.role ?? undefined,
        expertise: body.expertise?? undefined,
        socials:{
          create: body.socials?.map((social:{platform:string,url:string})=>{
            return {
              platform: social.platform,
              url: social.url,
            }
          })
        }
      }
    })
    //update socials
    //this will create new socials if they don't exist

    
    return NextResponse.json({ message: "User updated", user: userUpdate }, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
  }
}
