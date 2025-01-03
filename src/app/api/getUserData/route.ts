import { db } from "@/db";
import { triviasTable, usersTable } from "@/db/schema";
import { Trivia } from "@/interfaces/trivia";
import { UserData } from "@/interfaces/user";
import { getQuestionsOfTrivias, getSingleTrivia, getTriviaQuestions } from "@/utils/dbHelper";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { username } = await req.json()
    const decodedUsername = decodeURIComponent(username);
    try{
        const userData: UserData[] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, decodedUsername))

        if(userData.length > 0){
            return successResponse("Retrieved user data successfully!", userData)
        } else {
            return errorResponse("Couldn't fetch user data")
        }
    } catch (exc){
        console.error(exc)
        return errorResponse("Internal server error occured!")
    }
}