"use server";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";


export type Event = {
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


export const getEvents = async () => {
  'cache';
  try {
    const user = await currentUser();
    if (!user) {
      return { message: "User not found", status: 404, success: false };
    }
    const userId = await db.user.findFirst({
      where: { clerkUserId: user.id },
    });
    if (!userId) {
      return { message: "User not found", status: 404, success: false };
    }
    const events = await db.event.findMany({
      where: { userId: userId.id },
      orderBy:{createdAt:"desc"},
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
      },
    });
    if (!events || events.length === 0) {
      return { message: "No events found", status: 404, success: false };
    }
    return { events, message: "Events found", status: 200, success: true };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { message: "Error fetching events", status: 500, success: false };
  }
};

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




// export const editEventById = async (id: string, eventData: Event) => {
//   console.log(eventData);
//   try {
//     // Validate input parameters
//     if (!id) {
//       return { 
//         success: false,
//         message: "Event ID is required", 
//         status: 400 
//       };
//     }

//     if (!eventData) {
//       return { 
//         success: false,
//         message: "Event data is required", 
//         status: 400 
//       };
//     }

//     // Authenticate user
//     const user = await currentUser();
//     if (!user) {
//       return { 
//         success: false,
//         message: "User not authenticated", 
//         status: 401 
//       };
//     }

//     // Validate required fields
//     if (!eventData.title) {
//       return { 
//         success: false,
//         message: "Event title is required", 
//         status: 400 
//       };
//     }

//     // Ensure dateSlot is an array with a default empty array
//     const dateSlots = Array.isArray(eventData.dateSlot) 
//       ? eventData.dateSlot 
//       : [];

//     // Perform the database update
//     const updatedEvent = await db.event.update({
//       where: { id },
//       data: {
//         title: eventData.title,
//         description: eventData.description ?? null,
//         price: eventData.price,
//         // Clear and recreate date slots
//         dateSlot: {
//           deleteMany: {}, // Delete all existing date slots
//           create: dateSlots.map((dateSlot) => ({
//             date: dateSlot.date instanceof Date 
//               ? dateSlot.date 
//               : new Date(dateSlot.date),
//             timeSlot: {
//               create: (dateSlot.timeSlot || []).map((timeSlot) => ({
//                 time: timeSlot.time instanceof Date 
//                   ? timeSlot.time 
//                   : new Date(timeSlot.time),
//                 isBooked: timeSlot.isBooked ?? false
//               }))
//             }
//           }))
//         }
//       },
//       include: {
//         dateSlot: {
//           include: {
//             timeSlot: true
//           }
//         }
//       }
//     });

//     return {
//       success: true,
//       event: updatedEvent,
//       message: "Event updated successfully",
//       status: 200,
//     };
//   } catch (error) {
//     // Log the full error for server-side debugging
//     console.error('Error in editEventById:', error);

//     // Return a structured error response
//     return {
//       success: false,
//       message: error || "Failed to update event",
//       status: 500,
//       error: error instanceof Error 
//         ? {
//             name: error.name,
//             message: error.message,
//             stack: error.stack
//           }
//         : null
//     };
//   }
// };

export const editEventById = async (id: string, eventData: Event) => {
  console.log(eventData);
  try {
    // Input validation checks
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

    const user = await currentUser();
    if (!user) {
      return { 
        success: false, 
        message: "User not authenticated", 
        status: 401 
      };
    }

    if (!eventData.title) {
      return { 
        success: false, 
        message: "Event title is required", 
        status: 400 
      };
    }

    // Ensure dateSlot is an array
    const dateSlots = Array.isArray(eventData.dateSlot) 
      ? eventData.dateSlot 
      : [];

    // Get existing event
    const existingEvent = await db.event.findUnique({
      where: { id },
      include: {
        dateSlot: {
          include: {
            timeSlot: true
          }
        }
      }
    });

    if (!existingEvent) {
      return {
        success: false,
        message: "Event not found",
        status: 404
      };
    }

    // Update base event data
    const updatedEvent = await db.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description ?? null,
        price: eventData.price,
      },
    });

    // Handle date slots and time slots separately
    for (const dateSlot of dateSlots) {
      const date = dateSlot.date instanceof Date 
        ? dateSlot.date 
        : new Date(dateSlot.date);

      // Find existing date slot
      const existingDateSlot = existingEvent.dateSlot.find(ds => 
        ds.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
      );

      if (existingDateSlot) {
        // Update existing date slot
        const updatedDateSlot = await db.dateSlot.update({
          where: { id: existingDateSlot.id },
          data: { date }
        });

        // Handle time slots for this date
        if (dateSlot.timeSlot && Array.isArray(dateSlot.timeSlot)) {
          for (const timeSlot of dateSlot.timeSlot) {
            const time = timeSlot.time instanceof Date 
              ? timeSlot.time 
              : new Date(timeSlot.time);

            // Find existing time slot
            const existingTimeSlot = existingDateSlot.timeSlot.find(ts => 
              ts.time.toISOString() === time.toISOString()
            );

            if (existingTimeSlot) {
              // Update existing time slot
              await db.timeSlot.update({
                where: { id: existingTimeSlot.id },
                data: {
                  time,
                  isBooked: timeSlot.isBooked ?? false
                }
              });
            } else {
              // Create new time slot
              await db.timeSlot.create({
                data: {
                  dateSlotId: updatedDateSlot.id,
                  time,
                  isBooked: timeSlot.isBooked ?? false
                }
              });
            }
          }

          // Remove time slots that are no longer needed
          const newTimeSlotTimes = dateSlot.timeSlot.map(ts => 
            (ts.time instanceof Date ? ts.time : new Date(ts.time)).toISOString()
          );
          
          await db.timeSlot.deleteMany({
            where: {
              dateSlotId: updatedDateSlot.id,
              time: {
                notIn: newTimeSlotTimes
              }
            }
          });
        }
      } else {
        // Create new date slot with its time slots
        await db.dateSlot.create({
          data: {
            eventId: id,
            date,
            timeSlot: {
              create: (dateSlot.timeSlot || []).map(timeSlot => ({
                time: timeSlot.time instanceof Date 
                  ? timeSlot.time 
                  : new Date(timeSlot.time),
                isBooked: timeSlot.isBooked ?? false
              }))
            }
          }
        });
      }
    }

    // Remove date slots that are no longer needed
    const newDates = dateSlots.map(ds => 
      (ds.date instanceof Date ? ds.date : new Date(ds.date)).toISOString().split('T')[0]
    );

    await db.dateSlot.deleteMany({
      where: {
        eventId: id,
        date: {
          notIn: newDates.map(date => new Date(date))
        }
      }
    });

    // Fetch the final updated event
    const finalEvent = await db.event.findUnique({
      where: { id },
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
      event: finalEvent,
      message: "Event updated successfully",
      status: 200
    };
  } catch (error) {
    console.error('Error in editEventById:', error);
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

export const deleteEventById = async (id: string) => {
  try {
    // Validate input parameters
    if (!id) {
      return { 
        success: false,
        message: "Event ID is required", 
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
    const validUser = await db.user.findFirst({
      where: { clerkUserId: user.id },
    });
    if (!validUser) {
      return { 
        success: false,
        message: "User not found", 
        status: 404 
      };
    }
    // Perform the database delete operation
    await db.event.delete({ where: { id,userId:validUser.id } });

    return {
      success: true,
      message: "Event deleted successfully",
      status: 200,
    };
  } catch (error) {
    // Log the full error for server-side debugging
    console.error('Error in deleteEventById:', error);

    // Return a structured error response
    return {
      success: false,
      message: error || "Failed to delete event",
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
}