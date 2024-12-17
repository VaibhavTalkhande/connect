"use server";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
type Event = {
  id?: string;
  title: string;
  description: string | null;
  price: number;
  dateSlot: {
    id?: string;
    date: Date;
    timeSlot: {
      id?: string;
      time: Date;
      isBooked?: boolean;
    }[];
  }[];
}

export const getEventById = async (id: string):Promise<{event?: Event,message:string,status:number }| null> => {
  try {
    const event = await db.event.findFirst(
      {
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          dateSlot: {
            select: {
              id: true,
              date: true,
              timeSlot: {
                select: {
                  id: true,
                  time: true,
                  isBooked: true,
                },
              },
            },
          },
        }
      }
    );

    if (!event) {
      return { message: "Event not found", status: 404};
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





export const editEventById = async (id: string, eventData:Event ) => {
  const user = await currentUser();
  if (!user) {
    return { message: "User not found", status: 404 };
  }

  try {
    const existingEvent = await db.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        dateSlot: {
          select: {
            id: true,
            date: true,
            timeSlot: {
              select: {
                id: true,
                time: true,
                isBooked: true,
              },
            },
          },
        },


      }
    });

    if (!existingEvent) {
      return { message: "Event not found", status: 404 };
    }

    // Check for booked time slots
    const hasBookedSlots = existingEvent.dateSlot.some((dateSlot) =>
      dateSlot.timeSlot.some((timeSlot) => timeSlot.isBooked)
    );

    if (hasBookedSlots) {
      return {
        message: "Cannot delete or modify booked time slots.",
        status: 400,
      };
    }

    // Proceed to update the event
    const updatedEvent = await db.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description,
        price: eventData.price,
        dateSlot: {
          update: eventData.dateSlot.map((dateSlot: any) => ({
            where: { id: dateSlot.id },
            data: {
              date: dateSlot.date,
              timeSlot: {
                upsert: dateSlot.timeSlot.map((timeSlot: any) => ({
                  where: { id: timeSlot.id || undefined },
                  create: {
                    time: timeSlot.time,
                    isBooked: timeSlot.isBooked,
                  },
                  update: {
                    time: timeSlot.time,
                  },
                })),
              },
            },
          })),
        },
      },
    });

    return {
      event: updatedEvent,
      message: "Event updated successfully.",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      message: "Error updating event",
      status: 500,
    };
  }
};
