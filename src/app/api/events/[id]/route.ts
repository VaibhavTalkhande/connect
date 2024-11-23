import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



const getEventById = async (req: NextRequest) => {
    const url= new URL(req.url)
    const id = url.searchParams.get("id");
    
    try {
        const event = await db.event.findUnique({
            where: { id: id??undefined },
            include: {
                dateSlot: {
                    include: {
                        timeSlot: true,
                    }
                }
            }
        });
        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }
        return NextResponse.json({event,message:"Event found"}, { status: 200 });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ message: "Error fetching event" }, { status: 500 });
    }

}

const upEventById = async (req: NextRequest, res: NextResponse) => {
    
}

const deleteEventById = async (req: NextRequest, res: NextResponse) => {
        
    }

export { getEventById, upEventById, deleteEventById };