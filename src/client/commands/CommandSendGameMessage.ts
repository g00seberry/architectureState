import { ICommand } from "../../common/ICommand";
import { GameMessage } from "../../types";
import { getConnectionWithServer } from "../createConnectionWithServer";

export class CommandSendGameMessage implements ICommand {
  constructor(readonly data: GameMessage) {}

  execute() {
    const conn = getConnectionWithServer();
    conn.send(this.data);
  }
}
