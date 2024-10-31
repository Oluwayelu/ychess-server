import session from "express-session";
import { nanoid } from "nanoid";
import MongoStore from "connect-mongo";

import type { Session } from "express-session";
import type { IUser } from "../utils/types.js";

declare module "express-session" {
  interface SessionData {
    user: IUser;
  }
}

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      user: IUser;
    };
  }
}

const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chess",
    ttl: 14 * 24 * 60 * 60,
  }),
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  name: "ychess",
  proxy: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  genid: function () {
    return nanoid(21);
  },
});

export default sessionMiddleware;
