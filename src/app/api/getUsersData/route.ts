import { db } from "@/db";
import { triviasTable, usersTable } from "@/db/schema";
import { Trivia } from "@/interfaces/trivia";
import { UserData } from "@/interfaces/user";
import { getQuestionsOfTrivias, getSingleTrivia, getTriviaQuestions } from "@/utils/dbHelper";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const usersData: UserData[] = await db
        .select()
        .from(usersTable)
        .limit(50)
        .orderBy(desc(usersTable.points))
        console.log(usersData)

        console.log(usersData)

        if(usersData.length > 0){
            return successResponse("Retrieved user data successfully!", usersData)
        } else {
            return errorResponse("Couldn't fetch user data")
        }
    } catch (exc){
        console.error(exc)
        return errorResponse("Internal server error occured!")
    }
}