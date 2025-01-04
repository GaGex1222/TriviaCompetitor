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
    const updatedData: { bio?: string, username?: string, profileUrl?: string } = {
        bio: formData.get('bio') as string,
        username: formData.get('username') as string
    };
    if(profileImage.size > 0){
        const [success, imageUrl] = await uploadAWSImage(profileImage)
        if(success){
            updatedData.profileUrl = imageUrl as string
        } else {
            return errorResponse('Failed to upload image url to aws in edit user profile!')
        }
    }

    try{
        const newUserProfile = await db
        .update(usersTable)
        .set(updatedData)
        .where(eq(usersTable.id, userId))
        .returning()
        console.log(newUserProfile)
        return successResponse("Changed successfully user data!", newUserProfile)
    } catch(err){
        console.error(errorResponse)
        return errorResponse('Failed to change user data!')
    }
}