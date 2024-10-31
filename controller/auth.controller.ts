import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import type { Request, Response } from "express";
import { generateUsernames } from "../utils/helpers.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    if (req.session.user?.id && typeof req.session.user.id === "number") {
      res.status(403).end();
      return;
    }

    const { email, username, password } = req.body;

    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });
    if (emailExist) {
      res.status(400).json({ message: "User already exist" });
      return;
    }

    if (usernameExist) {
      const generatedUsernames = await generateUsernames(username);

      res
        .status(409)
        .json({ message: "Username already exist", data: generatedUsernames });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res
      .status(200)
      .json({ message: "User created successfully", data: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    if (req.session.user?.id && typeof req.session.user.id === "number") {
      res.status(403).end();
      return;
    }

    const { user, password } = req.body;
    const emailExist = await User.findOne({ email: user });

    let userExist;
    if (!emailExist) {
      const usernameExist = await User.findOne({ username: user });

      if (!usernameExist) {
        res.status(400).json({ message: "Invalid user details" });
        return;
      }
      userExist = usernameExist;
    } else {
      userExist = emailExist;
    }

    const comparePassword = await bcryptjs.compare(
      password,
      userExist.password
    );
    console.log(comparePassword);
    if (!comparePassword) {
      res.status(400).json({ message: "Invalid user details" });
      return;
    }

    const publicUser = {
      id: userExist.id,
      name: userExist.name,
    };

    req.session.user = {
      ...userExist.toObject(),
      password: undefined,
    };

    req.session.save(() => {
      res.status(200).json({
        message: "User loggedin successfull",
        data: req.session.user,
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentSession = async (req: Request, res: Response) => {
  try {
    if (req.session.user) {
      res
        .status(200)
        .json({ message: "Authenticated user", data: req.session.user });
    } else {
      res.status(204).json({ message: "No active session" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const anonymousSession = async (req: Request, res: Response) => {
  try {
    if (req.session.user?.id && typeof req.session.user.id === "number") {
      res.status(403).end();
      return;
    }
    const name = "Anonymous";
    if (!req.session.user || !req.session.user?.id) {
      const user = {
        id: req.session.id,
        name,
      };
      req.session.user = user;
    } else if (
      typeof req.session.user.id === "string" &&
      req.session.user.name !== name
    ) {
      req.session.user.name = name;
    }

    req.session.save(() => {
      res
        .status(201)
        .json({ message: "User loggedin successful", data: req.session.user });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutSession = async (req: Request, res: Response) => {
  try {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
