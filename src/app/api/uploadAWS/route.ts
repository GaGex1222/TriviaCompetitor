import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3"; 
import * as fs from "fs";
import * as dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
dotenv.config()

export async function POST(req: NextRequest){
    const formData = await req.formData();
    const file = formData.get('fileInput') as File;
    const tempDir = process.env.TEMP_DIR_PATH!
    const fileName = `${Date.now()}_${file.name}`
    const filePath = path.join(tempDir, fileName)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer)


    const config: S3ClientConfig = {
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
    };

    const uploadFileAWS = async () => {
        try {
            const client = new S3Client(config);
            const fileStream = fs.createReadStream(filePath)
            const input = { 
                Bucket: "trivia-competitors-image-storage",
                Key: fileName,
                Body: fileStream,
                ContentType: 'image/jpeg',
            };
            const command = new PutObjectCommand(input);
            const AWSresponse = await client.send(command);
            const fileURL = `http://trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com/${fileName}`
            if(AWSresponse['$metadata']['httpStatusCode'] == 200){
                console.log("RETURNING NOW TRUE FROM AWS")
                return NextResponse.json({success: "true", message: "Uploaded file to AWS successfully!", imageUrl: fileURL}, {status: 200})
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return NextResponse.json({success: "false", message: "Error uploading file to AWS!"}, {status: 500})
        }
    };
    return await uploadFileAWS()
}