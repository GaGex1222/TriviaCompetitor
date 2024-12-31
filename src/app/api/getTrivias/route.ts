import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable, usersTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { errorResponse, successResponse } from "@/utils/responseHelper";
export async function POST(req: NextRequest){
    const pageNumber = await req.json()
    console.log("PAGEN UM", pageNumber)
    const limit = 8
    const offset = (pageNumber - 1) * limit
    try{
        const trivias = await db
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
        const triviasWithQuestionsPromises = trivias.map(async (item) => {
            const questions = await db
            .select({
                questionId: questionsTable.id
            })
            .from(questionsTable)
            .where(eq(questionsTable.triviaId, item.id))


            return {
                ...item,
                questions: questions
            };
        });
        const triviasWithQuestions = await Promise.all(triviasWithQuestionsPromises)
        return successResponse("Receieved all trivias successfully!", triviasWithQuestions, "triviasWithQuestions")
    } catch(error) {
        console.log("Error occured when trying to fetch trivias: ", error)
        return errorResponse("Error occured when trying to fetch trivias")
    }
}