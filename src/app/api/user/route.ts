import { NextResponse } from "next/server"; // Import the NextResponse helper
import { db } from "../../../lib/prisma"; // Adjust the import path as necessary
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  try {
    // Fetch the logged-in user from the database
    const loggedUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedUser) {
      return NextResponse.json(loggedUser, { status: 200 });
    }

    // Create a new user if not found
    const name = `${user.firstName} ${user.lastName}`;
    const uniqueName = name.split(" ").join("_") + user.id.slice(-4);
    const updateUser = await clerkClient();
    console.log(uniqueName)
    const clerkUser = await updateUser.users.getUser(user.id);
    if (!clerkUser) {
      return NextResponse.json(
        { message: "Clerk user not found" },
        { status: 404 }
      );
    }

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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error fetching or creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

