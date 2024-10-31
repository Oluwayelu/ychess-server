import { Chess } from "chess.js";

import type { DisconnectReason, Socket } from "socket.io";
import Game from "../models/game.model.js";
import { IGame } from "../utils/types.js";

export const activeGames: IGame[] = [];

export async function join(this: Socket, code: string) {
  const game = activeGames.find((g) => g.code === code);

  if (!game) return;

  if (game.host.id === this.request.session.user.id) {
    game.host.connected = true;
    if (game.host.name !== this.request.session.user.name) {
      game.host.name = this.request.session.user.name;
    }
  }
}

export const createGame = () => {};
