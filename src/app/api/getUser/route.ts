import { db } from "@/db";
import { triviasTable, usersTable } from "@/db/schema";
import { Trivia } from "@/interfaces/trivia";
import { getQuestionsOfTrivias, getSingleTrivia, getTriviaQuestions } from "@/utils/dbHelper";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { username } = await req.json()
    const decodedUsername = decodeURIComponent(username);
    try{
        const userData = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, decodedUsername))

        console.log(userData)

        const triviasData: Trivia[] = await db
        .select({
            id: triviasTable.id,
            title: triviasTable.title,
            description: triviasTable.description,
            imageUrl: triviasTable.imageUrl,
            createdAt: triviasTable.createdAt
        })
        .from(triviasTable)
        .limit(4)
        .where(eq(triviasTable.creatorId, String(userData[0].id)))
        

        const triviasWithQuestions = await getQuestionsOfTrivias(triviasData)
        if(userData.length > 0){
            console.log("SUCCSESS")
            return successResponse("Retrieved user data successfully!", {triviasData: triviasWithQuestions, userData: userData})
        } else {
            console.log("BZZZZZZ")
            return errorResponse("Couldn't fetch user data")
        }
    } catch (exc){
        console.error(exc)
        return errorResponse("Internal server error occured!")
    }
}