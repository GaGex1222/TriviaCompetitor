import { NextRequest, NextResponse } from "next/server";
import { Trivia } from "@/interfaces/trivia";
import { triviasTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getQuestionsOfTrivias } from "@/utils/dbHelper";
import { db } from "@/db";
import { errorResponse, successResponse } from "@/utils/responseHelper";

export async function POST(req: NextRequest){
    const {userId, page} = await req.json()
    try{
        const triviasData: Trivia[] = await db
        .select({
            id: triviasTable.id,
            title: triviasTable.title,
            description: triviasTable.description,
            imageUrl: triviasTable.imageUrl,
            createdAt: triviasTable.createdAt
        })
        .from(triviasTable)
        .where(eq(triviasTable.creatorId, String(userId)))
        

        const triviasWithQuestions = await getQuestionsOfTrivias(triviasData)
        console.log(triviasWithQuestions)
        return successResponse("Retrieved user trivias successfully!", triviasWithQuestions)
    } catch (exc){
        console.error(exc)
        return errorResponse('Error retrieving user trivias!')
    }
}