import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import * as fs from 'fs';
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const deleteFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error removing file: ", err);
        } else {
            console.log("Removed file successfully!");
        }
    });
};

const config: S3ClientConfig = {
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    requestHandler: new NodeHttpHandler({
        connectionTimeout: 30000,
        socketTimeout: 30000,
    }),
};

export default async function uploadAWSImage(fileUploaded: File) {
    const tempDir = process.env.NODE_ENV === 'production' ? '/tmp' : 'C:/Users/gald1/Desktop/TriviaCompetitors/triviacompetitors/src/tempFiles';
    const fileName = `${Date.now()}_${fileUploaded.name}`;
    const filePath = path.join(tempDir, fileName);
    const buffer = Buffer.from(await fileUploaded.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    try {
        const client = new S3Client(config);
        const fileStream = fs.createReadStream(filePath);

        const input = {
            Bucket: "trivia-competitors-image-storage",
            Key: fileName,
            Body: fileStream,
            ContentType: 'image/jpeg',
        };

        const command = new PutObjectCommand(input);
        const AWSresponse = await client.send(command);

        const imageUrl = `http://trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com/${fileName}`;
        if (AWSresponse['$metadata']['httpStatusCode'] === 200 && AWSresponse.ETag) {
            return [true, imageUrl];
        } else {
            return [false, null];
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return [false, null];
    } finally {
        deleteFile(filePath);
    }
}
