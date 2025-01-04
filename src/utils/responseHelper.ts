import { NextResponse } from "next/server";

export function errorResponse(message: string) {
    return NextResponse.json({success: false, message: message,}, {status: 500});
}

export function successResponse(message: string, data?: any, dataName?: string){
    const responseData = dataName ? { [dataName]: data } : { data: data };
    return NextResponse.json({success: true, message: message, ...responseData}, {status: 200})
}