import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3"; 
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config()

const config: S3ClientConfig = {
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
};
console.log("HLELOLOL")
// Function to upload a file to AWS S3
const uploadFileAWS = async () => {
    try {
        const client = new S3Client(config);
        
        // Ensure the file exists at the specified path
        if (!fs.existsSync("MedalTVRoblox20241119024741.mp4")) {
            console.error("File not found: MedalTVRoblox20241119024741.mp4");
            return;
        }

        const fileStream = fs.createReadStream("MedalTVRoblox20241119024741.mp4");
        const input = { 
            Bucket: "trivia-competitors-image-storage", // required
            Key: "MedalTVRoblox20241119024741.mp4",
            Body: fileStream  // required
        };
        const command = new PutObjectCommand(input);
        const response = await client.send(command);
        console.log(response);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};

// Call the function to upload the file
uploadFileAWS();
