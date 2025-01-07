import { NextRequest } from "next/server";
import { Trivia } from "@/interfaces/trivia";
import { triviasTable, usersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { errorResponse, successResponse } from "@/utils/responseHelper";

export async function POST(req: NextRequest){
    const {userId, score} = await req.json()
    try{
        await db
        .update(usersTable)
        .set({points: sql`${usersTable.points} + ${Number(score)}`})
        .where(eq(usersTable.id, userId))
        

        return successResponse("Incremented points of the user successfully!")
    } catch (exc){
        console.error(exc)
        return errorResponse('Error Incrementing points of the user')
    }

}