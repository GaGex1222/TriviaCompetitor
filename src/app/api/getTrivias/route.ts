import { NextRequest } from "next/server";
import { db } from "@/db";
import { triviasTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { Trivia } from "@/interfaces/trivia";
import { getQuestionsOfTrivias } from "@/utils/dbHelper";
export async function POST(req: NextRequest){
    const pageNumber = await req.json()
    console.log("PAGEN UM", pageNumber)
    const limit = 8
    const offset = (pageNumber - 1) * limit
    try{
        const trivias: Trivia[] = await db
        .select({
            id: triviasTable.id,
            title: triviasTable.title,
            description: triviasTable.description,
            createdAt: triviasTable.createdAt,
            imageUrl: triviasTable.imageUrl,
            username: usersTable.username,
        })
        .from(triviasTable)
        .leftJoin(usersTable ,eq(triviasTable.creatorId, usersTable.id))
        .limit(limit)
        .orderBy(triviasTable.createdAt)
        .offset(offset)
        const triviasWithQuestions: Trivia[] = await getQuestionsOfTrivias(trivias)
        return successResponse("Receieved all trivias successfully!", triviasWithQuestions, "triviasWithQuestions")
    } catch(error) {
        console.log("Error occured when trying to fetch trivias: ", error)
        return errorResponse("Error occured when trying to fetch trivias")
    }
}