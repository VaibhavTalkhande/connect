import { db } from "@/lib/prisma";
import { NextApiRequest } from 'next';
import { NextResponse } from "next/server";


export async function GET(req: NextApiRequest, { params }: { params: { userId: string } }) {
    const { userId } =await params;

    if (!userId) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        }
    });
    
    if (user) {
        return NextResponse.json(user, { status: 200 });
    }
    return NextResponse.json({ message: "User not found" }, { status: 404 });
}