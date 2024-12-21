import * as fs from 'fs'
import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3"; 
import * as dotenv from "dotenv";
import { NextResponse } from "next/server";
import path from "path";
dotenv.config()

const deleteFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if(err){
            console.error("Error removing file: ", err)
        } else {
            console.log("Removed file successfully!")
        }
    })
}

export default async function uploadAWSImage(fileUploaded: File) {
    const tempDir = process.env.TEMP_DIR_PATH!
    const fileName = `${Date.now()}_${fileUploaded.name}`
    const filePath = path.join(tempDir, fileName)
    const arrayBuffer = await fileUploaded.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer)


    const config: S3ClientConfig = {
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
    };

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
        console.log("Sent the command")
        const fileURL = `http://trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com/${fileName}`
        if(AWSresponse['$metadata']['httpStatusCode'] == 200){
            console.log("RETURNING NOW TRUE FROM AWS")
            return [true, fileURL]
        } else {
            console.log("AWS response is not 200, false")
            
            return [false, null]
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return [false, null]
    } finally {
        deleteFile(filePath)
    }
}