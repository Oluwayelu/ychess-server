import User from "../models/user.model.js";

export const generateUsername = (username: string) => {
  const randomNum = Math.floor(Math.random() * 1000);

  return `${username}${randomNum}`;
};

export const generateUsernames = async (username: string) => {
  const generatedUsernames: string[] = [];

  while (generatedUsernames.length < 3) {
    const generatedUsername = generateUsername(username);

    const usernameExist = await User.findOne({ username: generatedUsername });

    if (!usernameExist) {
      generatedUsernames.push(generatedUsername);
    }
  }

  return generatedUsernames;
};

export const generateGameCode = () => {
  return Math.random().toString(36).substring(2, 8);
};
