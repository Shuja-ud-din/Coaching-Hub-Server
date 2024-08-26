import express from "express";
import { env } from "../config/env.js";
import { Server } from "socket.io";
const app = express();

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  // method : ["GET", "POST"]
});
