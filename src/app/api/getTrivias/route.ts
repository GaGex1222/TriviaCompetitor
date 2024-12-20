import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable } from "@/db/schema";
export async function POST(req: NextRequest){
    const pageNumber = await req.json()
    const limit = 8
    const offset = (pageNumber - 1) * limit
    try{
        const trivias = await db
        .select()
        .from(triviasTable)
        .limit(limit)
        .offset(offset)
        return NextResponse.json({success: true, message: "Receieved all trivias successfully!", data: trivias}, {status: 200})
    } catch(error) {
        console.log("Error occured when trying to fetch trivias: ", error)
        return NextResponse.json({success: false, message: "Error occured when trying to fetch trivias"}, {status: 500})
    }
}