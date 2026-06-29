import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();