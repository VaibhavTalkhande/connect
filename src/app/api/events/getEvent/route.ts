// /pages/api/events/index.ts
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const events = await db.event.findMany({
      include: {
        dateSlot: {
          include: {
            timeSlot: true,
          },
        },
      },
    });

    if (!events || events.length === 0) {
      return NextResponse.json({ message: "No events found" }, { status: 404 });
    }

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Error fetching events" },
      { status: 500 }
    );
  }
}
