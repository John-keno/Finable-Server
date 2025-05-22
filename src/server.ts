import app from "./app";
import { connectDB, PORT } from "./config";

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`❌ Error starting server: ${error}`);
    process.exit(1);
});
// This code connects to the MongoDB database and starts the server on the specified port.