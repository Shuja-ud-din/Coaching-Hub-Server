import express from "express";
import { env } from "../config/env.js";
import { Server } from "socket.io";
import { isTokenValid } from "../middlewares/authentication.js";
import app from "../app.js";

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

export let connectedUsers = [];

function disconnectSocketById(id) {
  const socketsToDisconnect = io.sockets.sockets.get(id);
  if (socketsToDisconnect) {
    socketsToDisconnect.disconnect(true);
    console.log(`Socket disconnected: ${id}`);
  } else {
    console.log(`Socket not found: ${id}`);
  }
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join", async (data) => {
    console.log(data.token);
    const user = isTokenValid(data.token);

    if (!user) {
      socket.emit("unauthorized", "invalid token");
      socket.disconnect();
      return;
    }

    socket.userId = user.userId;
    const userAlreadyConnected = connectedUsers.find(
      (connectedUser) => connectedUser.userId === user.userId
    );
    if (userAlreadyConnected) {
      socket.emit("unauthorized", "user already connected");
      disconnectSocketById(userAlreadyConnected.socketId);
    }

    connectedUsers = connectedUsers.filter(
      (connectedUsers) => connectedUsers.userId !== user.userId
    );

    connectedUsers.push({
      userId: user.userId,
      role: user.role,
      sockedId: socket.id,
    });

    console.log(connectedUsers);
    socket.broadcast.emit("onlineUsers", connectedUsers);
  });

  socket.on("sendMessage", (data) => {
    console.log(data);
    const receiver = connectedUsers.find((user) => user.userId !== data.sender);

    console.log(receiver);
    if (receiver) {
      socket.to(receiver.socketId).emit("newMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id, socket.userId);
    connectedUsers = connectedUsers.filter(
      (user) => user.userId != socket.userId
    );
    console.log(connectedUsers);
    socket.broadcast.emit("onlineUsers", connectedUsers);
  });
});
export { io, server };
