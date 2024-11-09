import { db } from "@/lib/prisma";


export async function POST(
req:Request, { params }: { params: { userId: string } }) {
    const { userId } =await params;
    console.log(userId)
  const body = await req.json();
  
  if (!body) {
    console.log("No body provided");
    return Response.json({
      message: "No body provided",
    },
    {status:400}
    )
  }

  const { role, bio, expertise } = body;
  console.log(role, bio, expertise)
  if (!role) {
    console.log("No role provided");
    return Response.json({
      message: "No role provided",
    },
    {status:400}
    )
  
  }
   if (!userId) {
    console.log("No userId provided");
    return Response.json({
      message: "No userId provided",
    },
    {status:400}
    )
  }

  // Try to find the user in the database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

    if (!user) {
        console.log("User not found  ${userId}");
        return Response.json({
            message: "User not found",
          },
          {status:404}
          )
    }
    

  // Update the user data
  const updatedUser = await db.user.update({
    where: {
      clerkUserId: userId,
    },
      data: {
          role,
          bio,
          expertise
      },
  });

  return Response.json({
    data: updatedUser,
    message: "User updated successfully",
  },
  {status:200}
  )
}
