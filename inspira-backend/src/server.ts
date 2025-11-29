import express from "express";
import cors from "cors";

import config from "./config";
import router from "./routes";
import errorHandler from "./middleware/error.middleware";
import prisma from "./prisma/client";

const app = express();

app.use(cors());
app.use(express.json());

// Mount all routes under /api (or just "/" if you prefer)
app.use("/api", router);

// Error handling middleware (after routes)
app.use(errorHandler);

const PORT = config.port || 5000;

prisma
  .$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
