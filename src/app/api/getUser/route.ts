import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { username } = await req.json()
    const decodedUsername = decodeURIComponent(username);
    console.log("sss", decodedUsername)
    try{
        const userData = await db
        .select({
            username: usersTable.username,
            points: usersTable.points,
            profileUrl: usersTable.profileUrl
        })
        .from(usersTable)
        .where(eq(usersTable.username, decodedUsername))
        console.log("User Data: ", userData[0])
        return NextResponse.json({success: true, message: "Retrieved user data successfully!", userData: userData[0]})
    } catch (exc){
        console.error(exc)
        return NextResponse.json({success: false, message: "Internal server error occured!"})
    }
}