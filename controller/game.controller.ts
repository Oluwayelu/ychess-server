import type { Request, Response } from "express";
import Game from "../models/game.model.js";
import { IGame, IUser } from "../utils/types.js";
import { activeGames } from "../socket/game.socket.js";
import { generateGameCode } from "../utils/helpers.js";

export const createGame = async (req: Request, res: Response) => {
  try {
    console.log("Session user: ", req.session.user);
    if (!req.session.user?._id) {
      res.status(401).json({ messgae: "Unauthorized" });
      return;
    }

    const user: IUser = {
      id: req.session.user._id,
      name: req.session.user.username,
      connected: false,
    };

    const game: IGame = {
      code: generateGameCode(),
      host: user.id as string,
      timeControl: req.body.timeControl,
    };

    if (req.body.side === "white") {
      game.white = user;
    } else if (req.body.side === "black") {
      game.black = user;
    } else {
      // random
      if (Math.floor(Math.random() * 2) === 0) {
        game.white = user;
      } else {
        game.black = user;
      }
    }

    const newGame = await Game.create(game);

    activeGames.push(game);
    res
      .status(200)
      .json({ message: "Game created successfully", data: newGame });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getActiveGame = async (req: Request, res: Response) => {
  try {
    if (!req.params || !req.params.code) {
      res.status(400).json({ message: "Code not included" });
      return;
    }

    const game = activeGames.find((g) => g.code === req.params.code);

    if (!game) {
      res.status(404).json({ message: "Game was not found" });
      return;
    }

    res.status(200).json({ message: "Successful", data: game });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
