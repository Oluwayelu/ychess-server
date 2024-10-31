import { Router } from "express";
import * as controller from "../controller/auth.controller.js";
const router = Router();
// get current user
router.route("/").get(controller.getCurrentSession);
// login as anonymous
router.route("/anonymous").post(controller.anonymousSession);
// register user
router.route("/register").post(controller.registerUser);
// login user
router.route("/login").post(controller.loginUser);
// logout session
router.route("/logout").get(controller.logoutSession);
export default router;
