const fs = require("fs");

// Reading a file as a stream
const readStream = fs.createReadStream("triviacompetitors/MedalTVRoblox20241119024741.mp4");
readStream.on("data", (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
});
