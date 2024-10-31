var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateUsernames } from "../utils/helpers.js";
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id) && typeof req.session.user.id === "number") {
            res.status(403).end();
            return;
        }
        const { email, username, password } = req.body;
        const emailExist = yield User.findOne({ email });
        const usernameExist = yield User.findOne({ username });
        if (emailExist) {
            res.status(400).json({ message: "User already exist" });
            return;
        }
        if (usernameExist) {
            const generatedUsernames = yield generateUsernames(username);
            res
                .status(409)
                .json({ message: "Username already exist", data: generatedUsernames });
            return;
        }
        const salt = yield bcryptjs.genSalt(10);
        const hashedPassword = yield bcryptjs.hash(password, salt);
        const newUser = yield User.create({
            email,
            username,
            password: hashedPassword,
        });
        res
            .status(200)
            .json({ message: "User created successfully", data: newUser });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id) && typeof req.session.user.id === "number") {
            res.status(403).end();
            return;
        }
        const { user, password } = req.body;
        const emailExist = yield User.findOne({ email: user });
        let userExist;
        if (!emailExist) {
            const usernameExist = yield User.findOne({ username: user });
            if (!usernameExist) {
                res.status(400).json({ message: "Invalid user details" });
                return;
            }
            userExist = usernameExist;
        }
        else {
            userExist = emailExist;
        }
        const comparePassword = yield bcryptjs.compare(password, userExist.password);
        console.log(comparePassword);
        if (!comparePassword) {
            res.status(400).json({ message: "Invalid user details" });
            return;
        }
        const publicUser = {
            id: userExist.id,
            name: userExist.name,
        };
        req.session.user = Object.assign(Object.assign({}, userExist.toObject()), { password: undefined });
        req.session.save(() => {
            res.status(200).json({
                message: "User loggedin successfull",
                data: req.session.user,
            });
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
export const getCurrentSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user) {
            res
                .status(200)
                .json({ message: "Authenticated user", data: req.session.user });
        }
        else {
            res.status(204).json({ message: "No active session" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
export const anonymousSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        if (((_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id) && typeof req.session.user.id === "number") {
            res.status(403).end();
            return;
        }
        const name = "Anonymous";
        if (!req.session.user || !((_d = req.session.user) === null || _d === void 0 ? void 0 : _d.id)) {
            const user = {
                id: req.session.id,
                name,
            };
            req.session.user = user;
        }
        else if (typeof req.session.user.id === "string" &&
            req.session.user.name !== name) {
            req.session.user.name = name;
        }
        req.session.save(() => {
            res
                .status(201)
                .json({ message: "User loggedin successful", data: req.session.user });
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
export const logoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy(() => {
            res.status(200).json({ message: "Logout successful" });
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
export const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
