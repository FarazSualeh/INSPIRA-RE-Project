import express from "express";
import cors from "cors";

import config from "./config";
import setupRoutes from "./routes";  // function, not router
import errorHandler from "./middleware/error.middleware";
import prisma from "./prisma/client";

const app = express();

app.use(cors());
app.use(express.json());

setupRoutes(app);              // call with app

app.get("/", (req, res) => {
  res.send("API is running");
});

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
