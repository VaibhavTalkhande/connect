import { db } from "@/lib/prisma";
import { SocialType } from "@/types/ModelTypes";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
req:NextRequest) {
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
      }
    })
    //update socials
    const socialPromises = body.socials.map(async (social: SocialType) => {
      if (social.link && social.link.trim() !== "") {
        await db.social.upsert({
          where: {
            userId_platform: { userId: userUpdate.id, platform: social.platform },
          },
          update: { link: social.link },  // Update if the platform already exists
          create: { platform: social.platform, link: social.link, userId: userUpdate.id }, // Create if the platform doesn't exist
        });
      }
    });
    //this will create new socials if they don't exist

    await Promise.all(socialPromises); // Wait for all socials to be updated

    return NextResponse.json({ message: "User updated", user: userUpdate }, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
  }
}
