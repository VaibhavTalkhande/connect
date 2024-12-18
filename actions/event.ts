"use server";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { json } from "stream/consumers";
import { object, z } from "zod";

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


export const createEvent = async (eventData: Event): Promise<{ event?: Event; message: string; status: number; success: boolean } | null> => {
  // Check if user is authenticated
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { message: "User not found", status: 404, success: false };
  }

  // Find the user in the database
  const user = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });
  if (!user) {
    return { message: "User not found", status: 404, success: false };
  }

  try {
    // Validate the event data
    if (!eventData) {
      return {
        success: false,
        message: "Event data is required",
        status: 400,
      };
    }

    // Validate required fields
    if (!eventData.title) {
      return {
        success: false,
        message: "Event title is required",
        status: 400,
      };
    }

    // Parse the event data to ensure all date and time fields are proper Date objects
    const parsedEventData = {
      ...eventData,
      dateSlot: eventData.dateSlot.map((dateSlot) => ({
        ...dateSlot,
        date: new Date(dateSlot.date), // Ensure date is a valid Date object
        timeSlot: dateSlot.timeSlot.map((timeSlot) => ({
          ...timeSlot,
          time: new Date(timeSlot.time), // Ensure time is a valid Date object
        })),
      })),
    };

    // Create the new event in the database
    const newEvent = await db.event.create({
      data: {
        title: parsedEventData.title,
        description: parsedEventData.description ?? null,
        price: parsedEventData.price,
        userId: user.id,
        dateSlot: {
          create: parsedEventData.dateSlot.map((dateSlot) => ({
            date: dateSlot.date, // Already parsed to Date
            timeSlot: {
              create: dateSlot.timeSlot.map((timeSlot) => ({
                time: timeSlot.time, // Already parsed to Date
                isBooked: timeSlot.isBooked ?? false,
              })),
            },
          })),
        },
      },
      include: {
        dateSlot: {
          include: {
            timeSlot: true,
          },
        },
      },
    });

    return {
      success: true,
      event: newEvent,
      message: "Event created successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      message: "Error creating event",
      status: 500,
    };
  }
};


export const getEventById = async (id: string):Promise<{event?: Event,message:string,status:number,success:boolean }| null> => {
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
      return { success:false, message: "Event not found", status: 404};
    }

 

    return {
      success: true,
      event: event,
      message: "Event found",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      message: "Error fetching event",
      status: 500,
    };
  }
};




export const editEventById = async (id: string, eventData: Event) => {
  console.log(eventData);
  try {
    // Validate input parameters
    if (!id) {
      return { 
        success: false,
        message: "Event ID is required", 
        status: 400 
      };
    }

    if (!eventData) {
      return { 
        success: false,
        message: "Event data is required", 
        status: 400 
      };
    }

    // Authenticate user
    const user = await currentUser();
    if (!user) {
      return { 
        success: false,
        message: "User not authenticated", 
        status: 401 
      };
    }

    // Validate required fields
    if (!eventData.title) {
      return { 
        success: false,
        message: "Event title is required", 
        status: 400 
      };
    }

    // Ensure dateSlot is an array with a default empty array
    const dateSlots = Array.isArray(eventData.dateSlot) 
      ? eventData.dateSlot 
      : [];

    // Perform the database update
    const updatedEvent = await db.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description ?? null,
        price: eventData.price,
        // Clear and recreate date slots
        dateSlot: {
          deleteMany: {}, // Delete all existing date slots
          create: dateSlots.map((dateSlot) => ({
            date: dateSlot.date instanceof Date 
              ? dateSlot.date 
              : new Date(dateSlot.date),
            timeSlot: {
              create: (dateSlot.timeSlot || []).map((timeSlot) => ({
                time: timeSlot.time instanceof Date 
                  ? timeSlot.time 
                  : new Date(timeSlot.time),
                isBooked: timeSlot.isBooked ?? false
              }))
            }
          }))
        }
      },
      include: {
        dateSlot: {
          include: {
            timeSlot: true
          }
        }
      }
    });

    return {
      success: true,
      event: updatedEvent,
      message: "Event updated successfully",
      status: 200,
    };
  } catch (error) {
    // Log the full error for server-side debugging
    console.error('Error in editEventById:', error);

    // Return a structured error response
    return {
      success: false,
      message: error || "Failed to update event",
      status: 500,
      error: error instanceof Error 
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        : null
    };
  }
};