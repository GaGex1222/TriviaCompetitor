import uploadAWSImage from "@/AWSFunctions";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const formData = await req.formData();
    const profileImage = formData.get('profileImage') as File
    const userId = formData.get('userId') as unknown as number

    if(profileImage){
        const [success, imageUrl] = await uploadAWSImage(profileImage)
        const updatedData = {
            bio: formData.get('bio') as string,
            username: formData.get('username') as string,
            profileImage: imageUrl
        };
        if(success){
            try{
                await db
                .update(usersTable)
                .set(updatedData)
                .where(eq(usersTable.id, userId))
                return successResponse("Changed successfully user data!", {})
            } catch(err){
                console.error(errorResponse)
                return errorResponse('Failed to change user data!')
            }
        }
    }
}