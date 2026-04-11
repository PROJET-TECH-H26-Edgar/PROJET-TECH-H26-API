import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import yaml from "yamljs";
import path from "path";
import https from "https";
import swaggerUi from "swagger-ui-express";
import "./services/mqtt.service";

import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import { keyRouter } from "./routes/key.routes";
import { BorrowRouter } from "./routes/borrow.route";

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

/*
-------------------------------------------------
Routes
-------------------------------------------------
*/

app.get("/", (_req, res) => {
  res.json({
    name: "DistributeurCle",
    status: "running",
    docs: "/swagger",
    health: "/api/ping",
  });
});

app.get("/api/ping", (_req, res) => {
  res.status(200).send("pong");
});

app.use("/api/auth", authRouter());
app.use("/api/key", keyRouter());
app.use("/api/borrows", BorrowRouter());

/*
-------------------------------------------------
Swagger
-------------------------------------------------
*/

const swaggerPath = path.resolve(process.cwd(), "src/swagger.yml");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(yaml.load(swaggerPath)));

/*
-------------------------------------------------
Error Handler
-------------------------------------------------
*/

app.use(errorHandler);

/*
-------------------------------------------------
Security logs
-------------------------------------------------
*/

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, reason);
});

/*
-------------------------------------------------
Server Start
-------------------------------------------------
*/

if (process.env.NODE_ENV === "production") {
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/distributeurcle.edwrdledgar.me/privkey.pem",
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/distributeurcle.edwrdledgar.me/fullchain.pem",
    ),
  };

  https.createServer(sslOptions, app).listen(port, () => {
    console.log(`HTTPS running on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
  });
}
