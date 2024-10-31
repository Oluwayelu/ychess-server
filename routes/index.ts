import { Router } from "express";

import auth from "./auth.route.js";
import game from "./game.route.js";

const router = Router();

router.use("/auth", auth);

router.use("/game", game);

export default router;
