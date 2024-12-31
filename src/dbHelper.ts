import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { triviasTable, usersTable } from "./db/schema";

export async function insertTrivia(title: string, description: string, userId: string, imageUrl: string){
    const insertQuery = await db.insert(triviasTable).values({
        title: title,
        description: description,
        creatorId: userId,
        imageUrl: imageUrl as string,
    }).returning();

    return insertQuery[0].id
}

export async function mergeQuestionsAndOptions(){
    
}

export async function addPointsToUser(username: string, pointsAmount: number){
    try{
        await db.
        update(usersTable)
        .set({
            points: sql`${usersTable.points} + ${pointsAmount}`
        })
        .where(eq(usersTable.username ,username))
    } catch(err){
        console.error(`error adding points to ${username}`, err)
        return false
    }
    return true
}