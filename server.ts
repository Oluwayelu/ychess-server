import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import { initializeSocket } from "./socket/index.js";
import routes from "./routes/index.js";
import session from "./middleware/session.js";

import "dotenv/config";

import type { Request, Response, NextFunction } from "express";

const corsConfig = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
};

const app = express();
const server = createServer(app);

app.use(cors(corsConfig));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session);
app.use("/v1", routes);

export const io = new Server(server, {
  cors: corsConfig,
  pingInterval: 30000,
  pingTimeout: 50000,
});

io.use((socket, next) => {
  session(socket.request as Request, {} as Response, next as NextFunction);
});

io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.user) {
    next();
  } else {
    console.log("io.use: no session");
    socket.disconnect();
  }
});

initializeSocket();

// Datatbase connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("Db Connceted");
  })
  .catch((err) => {
    console.log(err.message);
  });

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`ychess api server listening on :${port}`);
});
