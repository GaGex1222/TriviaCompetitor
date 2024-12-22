import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest){
    const { triviaId } = await req.json()
    console.log("TITIT", triviaId)
    try{
        const triviaQuery = await db
        .select({
            id: triviasTable.id,
            title: triviasTable.title,
            description: triviasTable.description,
            createdAt: triviasTable.createdAt,
            imageUrl: triviasTable.imageUrl,
            username: usersTable.username,
        })
        .from(triviasTable)
        .where(eq(triviasTable.id, triviaId))
        .leftJoin(usersTable, eq(usersTable.id, triviasTable.creatorId))

        const numOfQuestions = await db
        .select({
            questionId: questionsTable.id,
        })
        .from(questionsTable)
        .where(eq(questionsTable.triviaId, triviaId))

        const triviaWithQuestions = {
            ...triviaQuery[0],
            questions: numOfQuestions

        }
        return NextResponse.json({success: true, message: "Successfully retrieved single trivia!", data: triviaWithQuestions}, {status: 200})
    } catch (err) {
        console.log("Error fetching single trivia", err)
        return NextResponse.json({success: false, message: "Error occured while fetching single trivia"}, {status: 500})
    }
}