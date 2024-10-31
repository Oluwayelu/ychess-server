import { Router } from "express";
import * as controller from "../controller/game.controller.js";

const router = Router();

// Create a game
router.route("/create").post(controller.createGame);

// Get active game
router.route("/:code").get(controller.getActiveGame);

export default router;
