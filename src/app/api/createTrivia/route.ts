import { NextRequest, NextResponse } from "next/server";
import uploadAWSImage from "../../../AWSFunctions";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable } from "@/db/schema";
import { insertTrivia } from "@/dbHelper";
import { Questions } from "@/interfaces/question";
import { errorResponse, successResponse } from "@/utils/responseHelper";

export async function POST(req: NextRequest){
    const formData = await req.formData();
    const file = formData.get("fileInput") as File;
    const title = formData.get('titleInput') as string;
    const description = formData.get('descriptionInput') as string;
    const userId = formData.get('userId') as string;
    const questionsData: Questions[] = JSON.parse(formData.get('questionsData') as string);

    if(!file){
        return errorResponse("File not found.")
    }

    try {
        const [success, imageUrl] = await uploadAWSImage(file)
        if(!success){
            return NextResponse.json({success: "false", message: "Internal server occured!"}, {status: 500})
        } else {
            const insertedTriviaId = await insertTrivia(title, description, userId, imageUrl as string)
            const questionOptionsArray = []
            // // now adding question for each table
            const questionsArray = Object.values(questionsData).map((question: Questions) => {
                return {
                    title: question['questionTitle'],
                    triviaId: insertedTriviaId,
                    imageUrl: imageUrl as string,
                }
            })

            const insertedQuestions = await db.insert(questionsTable).values(questionsArray).returning({questionId: questionsTable.id})
            // adding questionOption for each question added
            for (let i = 0; i < Object.values(questionsData).length; i++) {
                const questionData = Object.values(questionsData)[i];
                const insertedQuestionTitle = insertedQuestions[i].questionId;
            
                // Populate the options array with question ID from the inserted questions
                for (const option of Object.values(questionData.options)) {
                    questionOptionsArray.push({
                        questionOptionTitle: option.text,
                        questionId: insertedQuestionTitle,
                        correctAnswer: option.isCorrect ? 1 : 0,
                    });
                }
            }

            await db.insert(questionOptionsTable).values(questionOptionsArray);
            return successResponse("Uploaded Trivia!", insertedTriviaId, 'insertedTriviaId')
        }
    } catch (error){
        console.log("Error creating trivia: ", error)
        return errorResponse("File not found.")
    }
    
}