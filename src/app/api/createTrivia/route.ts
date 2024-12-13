import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest){
    const {formData, userId} = await req.json();
    const file = formData.get("fileInput")
    const title = formData.get('titleInput')
    const category = formData.get('categoryInput')
    if(!file){
        return NextResponse.json({success: "false", message: "File not found."}, {status: 404})
    }
    const AWSResponse = await fetch('http://localhost:3000/api/uploadAWS', {
        method: "POST",
        body: formData
    })
    console.log(AWSResponse.status + "SGSGG")
    if(AWSResponse.status == 500){
        return NextResponse.json({success: "false", message: "Internal server occured!"}, {status: 500})
    } else{
        const AWSResponseData = await AWSResponse.json()
        const imageUrl = AWSResponseData['imageUrl']

        return NextResponse.json({success: "true", message: "Created Trivia Successfully!"}, {status: 200})
    }
}