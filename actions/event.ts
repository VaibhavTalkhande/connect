"use server";
import { db } from "@/lib/prisma";

const getEventById = async (id: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id: id ?? undefined },
      include: {
        dateSlot: {
          include: {
            timeSlot: true,
          },
        },
      },
    });

    if (!event) {
      return { message: "Event not found", status: 404 };
    }

 

    return {
      event: event,
      message: "Event found",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      message: "Error fetching event",
      status: 500,
    };
  }
};

export default getEventById;
