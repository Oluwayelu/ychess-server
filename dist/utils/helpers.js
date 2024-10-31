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
export const generateUsername = (username) => {
    const randomNum = Math.floor(Math.random() * 1000);
    return `${username}${randomNum}`;
};
export const generateUsernames = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const generatedUsernames = [];
    while (generatedUsernames.length < 3) {
        const generatedUsername = generateUsername(username);
        const usernameExist = yield User.findOne({ username: generatedUsername });
        if (!usernameExist) {
            generatedUsernames.push(generatedUsername);
        }
    }
    return generatedUsernames;
});
export const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8);
};
