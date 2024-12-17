"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const getBooking = async () => {
  const { userId } = await auth();

  if (!userId) {
    return {
      message: "User not found",
      status: 404,
    };
  }

  try {
    const bookings = await db.booking.findMany({
      where: { userId },
      include: {
        timeSlot: {
          include: {
            dateSlot: {
              include: {
                event: {
                  include: {
                    user: { select: { name: true, email: true } }, // Include mentor details
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      bookings,
      message: "Bookings found",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error fetching bookings",
      status: 500,
    };
  }
};

export default getBooking;