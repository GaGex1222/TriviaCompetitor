import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { username } = await req.json()
    const decodedUsername = decodeURIComponent(username);
    try{
        const userData = await db
        .select({
            username: usersTable.username,
            points: usersTable.points,
            profileUrl: usersTable.profileUrl
        })
        .from(usersTable)
        .where(eq(usersTable.username, decodedUsername))
        if(userData.length > 0){
            console.log("SUCCSESS")
            return successResponse("Retrieved user data successfully!", userData, 'userData')
        } else {
            console.log("BZZZZZZ")
            return errorResponse("Couldn't fetch user data")
        }
    } catch (exc){
        console.error(exc)
        return errorResponse("Internal server error occured!")
    }
}