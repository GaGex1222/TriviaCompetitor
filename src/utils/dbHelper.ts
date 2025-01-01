import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { triviasTable, usersTable, questionsTable } from "../db/schema";
import { Trivia } from "@/interfaces/trivia";

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

export async function getTriviaQuestions(triviaId: number){
    const numOfQuestions = await db
    .select({
        questionId: questionsTable.id,
    })
    .from(questionsTable)
    .where(eq(questionsTable.triviaId, triviaId))
    return numOfQuestions
}

export async function getQuestionsOfTrivias(triviasObject: Trivia[]){
    const triviasWithQuestionsPromises = triviasObject.map(async (trivia) => {
        const questions = await db
        .select({
            questionId: questionsTable.id
        })
        .from(questionsTable)
        .where(eq(questionsTable.triviaId, trivia.id))


        return {
            ...trivia,
            questions: questions
        };
    });
    const triviasWithQuestions = await Promise.all(triviasWithQuestionsPromises)
    return triviasWithQuestions
}

export async function getSingleTrivia(triviaId: number){
    // checking whether i should search the db with trivia id or username
    const triviaQuery = await db
    .select({
        id: triviasTable.id,
        title: triviasTable.title,
        description: triviasTable.description,
        createdAt: triviasTable.createdAt,
        imageUrl: triviasTable.imageUrl,
        username: usersTable.username,
    })
    .from(triviasTable)
    .where(eq(triviasTable.id, triviaId))
    .leftJoin(usersTable, eq(usersTable.id, triviasTable.creatorId))

    const numOfQuestions = getTriviaQuestions(triviaId)

    const triviaWithQuestions = {
        ...triviaQuery[0],
        questions: numOfQuestions
    }
    console.log("WHILE OVJECT", triviaWithQuestions)
    return triviaWithQuestions
}