var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Game from "../models/game.model.js";
import { activeGames } from "../socket/game.socket.js";
import { generateGameCode } from "../utils/helpers.js";
export const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Session user: ", req.session.user);
        if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id)) {
            res.status(401).json({ messgae: "Unauthorized" });
            return;
        }
        const user = {
            id: req.session.user._id,
            name: req.session.user.username,
            connected: false,
        };
        const game = {
            code: generateGameCode(),
            host: user.id,
            timeControl: req.body.timeControl,
        };
        if (req.body.side === "white") {
            game.white = user;
        }
        else if (req.body.side === "black") {
            game.black = user;
        }
        else {
            // random
            if (Math.floor(Math.random() * 2) === 0) {
                game.white = user;
            }
            else {
                game.black = user;
            }
        }
        const newGame = yield Game.create(game);
        activeGames.push(game);
        res
            .status(200)
            .json({ message: "Game created successfully", data: newGame });
    }
    catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});
export const getActiveGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});
