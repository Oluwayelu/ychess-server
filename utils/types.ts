export interface TimeControl {
  name: string;
  type: string;
  time: Time;
}

export interface Time {
  secs: number;
  increment: number;
}

export interface IUser {
  _id?: string;
  id?: number | string; // string for guest IDs
  name?: string | null;
  username?: string;
  email?: string;
  wins?: number;
  losses?: number;
  draws?: number;

  // mainly for players, not spectators
  connected?: boolean;
  disconnectedOn?: number;
}

export interface IGame {
  _id?: number;
  pgn?: string;
  white?: IUser;
  black?: IUser;
  winner?: "white" | "black" | "draw";
  endReason?:
    | "draw"
    | "checkmate"
    | "stalemate"
    | "repetition"
    | "insufficient"
    | "abandoned";
  host: IUser & string;
  code: string;
  unlisted?: boolean;
  timeout?: number;
  timeControl?: TimeControl;
  observers?: IUser[];
}
