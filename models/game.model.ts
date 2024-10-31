import mongoose from "mongoose";
const { Schema, models } = mongoose;

const gameSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pgn: {
      type: String,
    },
    winner: {
      type: String,
      enum: ["white", "black", "draw"],
    },
    end_reason: {
      type: String,
      enum: [
        "draw",
        "checkmate",
        "stalemate",
        "repetition",
        "insufficient",
        "abandoned",
      ],
    },
    white: {
      id: String,
      name: String,
      connected: Boolean,
    },
    black: {
      id: String,
      name: String,
      connected: Boolean,
    },
    timeControl: {
      type: { type: String },
      name: { type: String },
      time: {
        secs: { type: Number, default: 0 },
        increment: { type: Number, default: 0 },
      },
    },
    observers: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Game = models.Game || mongoose.model("Game", gameSchema);

export default Game;
