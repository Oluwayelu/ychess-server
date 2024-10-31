var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const activeGames = [];
export function join(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const game = activeGames.find((g) => g.code === code);
        if (!game)
            return;
        if (game.host.id === this.request.session.user.id) {
            game.host.connected = true;
            if (game.host.name !== this.request.session.user.name) {
                game.host.name = this.request.session.user.name;
            }
        }
    });
}
export const createGame = () => { };
