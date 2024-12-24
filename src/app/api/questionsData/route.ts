import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable, usersTable } from "@/db/schema";
import { QuestionsAndOptions } from "@/interfaces/questionsAndOptions";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest){
    try{
        const triviaId = await req.json()
        const questions = await db
        .select({
            id: questionsTable.id,
            title: questionsTable.title,
            imageUrl: questionsTable.imageUrl
        })
        .from(questionsTable)
        .where(eq(questionsTable.triviaId, triviaId))
    
        const questionsAndOptionsPromises = questions.map(async (question) => {
            const questionOptions = await db
            .select({
                questionOptionTitle: questionOptionsTable.questionOptionTitle,
                correctAnswer: questionOptionsTable.correctAnswer
            })
            .from(questionOptionsTable)
            .where(eq(questionOptionsTable.questionId, question.id))
            const organaizedObject = {}
            for (let option of questionOptions) {
                organaizedObject[option.questionOptionTitle] = option.correctAnswer
            }

            const currentPromise: QuestionsAndOptions = {
                ...question,
                questionOptions: organaizedObject
            }

            return currentPromise
        })
        const questionsAndOptions = await Promise.all(questionsAndOptionsPromises)
        console.log(questionsAndOptions)
        return NextResponse.json({success: true, message: "Successfully fetched questionsData!", data: questionsAndOptions})
    } catch(error){
        console.log(error)
        return NextResponse.json({success: false, message: "Couldn't fetch questionsData, try again later and check logs"})
    }

}