import { db } from "./db";
import { triviasTable } from "./db/schema";

export async function insertTrivia(title: string, description: string, userId: string, imageUrl: string){
    const insertQuery = await db.insert(triviasTable).values({
        title: title,
        description: description,
        creatorId: userId,
        imageUrl: imageUrl as string,
    }).returning();

    return insertQuery[0].id
}