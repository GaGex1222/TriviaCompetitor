import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { getSingleTrivia } from "@/utils/dbHelper";
export async function POST(req: NextRequest){
    const { triviaId } = await req.json()
    console.log("TITIT", triviaId)
    try{
        const triviaWithQuestions = await getSingleTrivia(triviaId)
        return successResponse("Successfully retrieved single trivia!", triviaWithQuestions)
    } catch (err) {
        console.log("Error fetching single trivia", err)
        return errorResponse("Error occured while fetching single trivia")
    }
}