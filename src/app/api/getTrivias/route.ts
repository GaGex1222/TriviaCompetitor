import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionOptionsTable, questionsTable, triviasTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest){
    const pageNumber = await req.json()
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
        .offset(offset)
        console.log(trivias)
        return NextResponse.json({success: true, message: "Receieved all trivias successfully!", data: trivias}, {status: 200})
    } catch(error) {
        console.log("Error occured when trying to fetch trivias: ", error)
        return NextResponse.json({success: false, message: "Error occured when trying to fetch trivias"}, {status: 500})
    }
}