import { db } from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET() {
  const user = await currentUser();
  if (!user) {
    return ;
  }

  try {
    // Fetch the logged-in user from the database
    const loggedUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedUser) {
      return NextResponse.json({ message: "User already exists", user: loggedUser }, { status: 200 });
    }

    // Create a new user if not found
    const name = `${user.firstName} ${user.lastName}`;
    const uniqueName = name.split(" ").join("_") + user.id.slice(-4);
    const updateUser = await clerkClient();
    console.log(uniqueName);


    // Update the user name in Clerk
    await updateUser.users.updateUser(user.id, {
      username: uniqueName,
    });

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: uniqueName,
      },
    });

    return NextResponse.json({ message: "User created", user: newUser }, { status: 200 });
  } catch (error) {
    console.error("Error fetching or creating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}