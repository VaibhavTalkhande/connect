// pages/api/events/create.ts

import { z } from "zod";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" });
  }

  try {
    const eventData = await req.json();
    // if (!data.dateSlots || !Array.isArray(data.dateSlots)) {
    //   throw new Error("Invalid dateSlots data");
    // }

    // const formattedDateSlots = data.dateSlots.map((dateSlot: any) => {
    //   const date = new Date(dateSlot.date);
    //   if (isNaN(date.getTime()))
    //     throw new Error(`Invalid date format: ${dateSlot.date}`);

    //   return {
    //     date,
    //     timeSlot: {
    //       create: dateSlot.timeSlots.map((timeSlot: any) => {
    //         const time = timeSlot.time;
    //         if (!time) throw new Error("Missing time value");

    //         const combinedDateTime = new Date(
    //           `${dateSlot.date.split("T")[0]}T${time}`
    //         );
    //         if (isNaN(combinedDateTime.getTime()))
    //           throw new Error(`Invalid time format: ${time}`);

    //         return { time: combinedDateTime, isBooked: false };
    //       }),
    //     },
    //   };
    // });

    // const createdEvent = await db.event.create({
    //   data: {
    //     title: data.title,
    //     description: data.description,
    //     price: data.price,
    //     userId: user.id,
    //     dateSlot: { create: formattedDateSlots },
    //   },
    //   include: { dateSlot: { include: { timeSlot: true } } },
    // });

    const createdEvent = await db.event.create({
      data: {
        title: eventData.title,
        description: eventData.description ?? null,
        price: eventData.price,
        userId: user.id,
        dateSlot: {
          create: eventData.dateSlot.map((dateSlot:{date:Date,timeSlot:{time:Date,isBooked:false}[]}) => ({
            date: dateSlot.date instanceof Date ? dateSlot.date : new Date(dateSlot.date),
            timeSlot: {
              create: dateSlot.timeSlot.map((timeSlot) => ({
                time: timeSlot.time instanceof Date ? timeSlot.time : new Date(timeSlot.time),
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

    return NextResponse.json({success:true, event: createdEvent }, { status: 201 });
  } catch (error:any) {
    return NextResponse.json(
      {success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
