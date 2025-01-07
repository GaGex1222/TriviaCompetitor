import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { UserData } from "@/interfaces/user";
import { errorResponse, successResponse } from "@/utils/responseHelper";
import { desc } from "drizzle-orm";

export async function GET(){
    try{
        const usersData: UserData[] = await db
        .select()
        .from(usersTable)
        .limit(50)
        .orderBy(desc(usersTable.points))
        console.log(usersData)

        console.log(usersData)

        if(usersData.length > 0){
            return successResponse("Retrieved user data successfully!", usersData)
        } else {
            return errorResponse("Couldn't fetch user data")
        }
    } catch (exc){
        console.error(exc)
        return errorResponse("Internal server error occured!")
    }
}