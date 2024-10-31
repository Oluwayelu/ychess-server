import { Socket } from "socket.io";
import { io } from "../server.js";
import { join } from "./game.socket.js";

const gamesInSession = [];

export const initializeSocket = () => {
  io.on("connection", (socket: Socket) => {
    const req = socket.request;

    socket.use((_, next) => {
      req.session.reload((err) => {
        if (err) {
          socket.disconnect();
        } else {
          next();
        }
      });
    });

    socket.on("join", join);
  });
};
