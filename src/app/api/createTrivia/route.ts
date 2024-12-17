import { NextRequest, NextResponse } from "next/server";
import uploadAWSImage from "../../../../AWSFunctions";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable } from "@/db/schema";
export async function POST(req: NextRequest){
    const formData = await req.formData();
    const file = formData.get("fileInput") as File;
    const title = formData.get('titleInput') as string;
    const category = formData.get('categoryInput') as string;
    const userId = formData.get('userId') as string;
    const questionsData = JSON.parse(formData.get('questionsData') as string);
    if(!file){
        return NextResponse.json({success: "false", message: "File not found."}, {status: 404})
    }
    const [success, imageUrl] = await uploadAWSImage(file)
    if(!success){
        return NextResponse.json({success: "false", message: "Internal server occured!"}, {status: 500})
    } else {
        const insertQuery = await db.insert(triviasTable).values({
            title: title,
            category: category,
            creatorId: userId,
            imageUrl: imageUrl as string,
        }).returning();
        const insertedTriviaId = insertQuery[0].id
        const questionOptionsArray: Object[] = []
        // now adding question for each table
        for(const [questionNumber, questionData] of Object.entries(questionsData)){
            const insertedQuestionTitle = await db.insert(questionsTable).values({
                title: questionData['questionTitle'],
                triviaId: insertedTriviaId,
                imageUrl: imageUrl
            })
            // construct question options array
            for(let i = 0; i < Object.keys(questionData).length; i++){
                if(Object.keys(questionData)[i] == "questionTitle"){
                    continue
                } else {
                    questionOptionsArray.push({
                        "questionOptionTitle": questionData[Object.keys(questionData)[i]],
                        "questionId": insertedQuestionTitle[0].id
                    })
                }   
            }
        }
        // insert options for each question
        await db
        .insert(questionOptionsTable)
        .values(questionOptionsArray)
        return NextResponse.json({success: "true", message: "Uploaded Trivia!"}, {status: 500})
    }
    
}