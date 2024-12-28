import { NextRequest, NextResponse } from "next/server";
import uploadAWSImage from "../../../AWSFunctions";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable } from "@/db/schema";
import { insertTrivia } from "@/dbHelper";
import { Questions } from "@/interfaces/question";

export async function POST(req: NextRequest){
    const formData = await req.formData();
    const file = formData.get("fileInput") as File;
    const title = formData.get('titleInput') as string;
    const description = formData.get('descriptionInput') as string;
    const userId = formData.get('userId') as string;
    const questionsData = JSON.parse(formData.get('questionsData') as string);
    console.log(questionsData)

    if(!file){
        return NextResponse.json({success: "false", message: "File not found."}, {status: 404})
    }

    try {
        const [success, imageUrl] = await uploadAWSImage(file)
        if(!success){
            return NextResponse.json({success: "false", message: "Internal server occured!"}, {status: 500})
        } else {
            const insertedTriviaId = await insertTrivia(title, description, userId, imageUrl as string)
            const questionOptionsArray = []
            // // now adding question for each table
            Object.values(questionsData).map(async (questionData: Questions) => {
                const insertedQuestionTitle = await db.insert(questionsTable).values({
                    title: questionData['questionTitle'],
                    triviaId: insertedTriviaId,
                    imageUrl: imageUrl as string 
                }).returning()

                Object.values(questionData.options).map(async (option) => {
                    console.log(option.text, option.isCorrect)
                    questionOptionsArray.push({
                        "questionOptionTitle": option.text,
                        "questionId": insertedQuestionTitle[0].id,
                        "correctAnswer": option.isCorrect ? 1 : 0
                    })
                })
            })

            console.log(questionOptionsArray)
            await db.insert(questionOptionsTable).values(questionOptionsArray)
            return NextResponse.json({success: "true", message: "Uploaded Trivia!", insertedTriviaId: insertedTriviaId}, {status: 200})
        }
    } catch (error){
        console.log("Error creating trivia: ", error)
        return NextResponse.json({success: "false", message: "Error uploading Trivia!"}, {status: 200})
    }
    
}