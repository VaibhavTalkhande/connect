import {db} from './prisma';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

export const checkUser = async ()=>{
    const user = await currentUser();
    if(!user){
        return null;
    }
    try {
        const loggedUser = await db?.user.findUnique({
            where:{
                clerkUserId: user.id,
            }
        })
        if(loggedUser){
            return loggedUser;
        }
        // create a new user
        const name = `${user.firstName} ${user.lastName}`;
        const uniqueName = name.split('').join('-') + user.id.slice(-4);
        // update the user name
        (await clerkClient()).users.updateUser(user.id,{
            username: uniqueName,// this  split and join is to remove spaces with hyphens and add the last 4 digits of the user id -4 return the last 4 digits
        })
        const newUser = await db.user.create({
            data:{
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email:user.emailAddresses[0].emailAddress,
                username: uniqueName,
            }
        })
        return newUser;
    } catch (error) {
        console.error(error);
    }
}