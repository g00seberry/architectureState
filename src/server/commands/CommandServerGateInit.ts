import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { ICommand } from "../../common/ICommand";
import { parseWSData } from "../../gameCore/utils";
import { getConnectionsRegister } from "../ConnectionsReg";
import { WSConnection } from "../WSConnection";
import { IoCResolveServer } from "../bootIoC4Server";

const getClientId = (data: unknown) =>
  String((data as IncomingMessage).headers["x-client-token"]);

const conReg = getConnectionsRegister();

export class CommandServerGateInit implements ICommand {
  execute() {
    return new Promise((res, rej) => {
      const wss = new WebSocket.Server({ port: 8080 });
      wss.on("connection", (ws, a: IncomingMessage) => {
        conReg.add(getClientId(a), new WSConnection(ws));
        ws.on("message", (message) => {
          const msg = parseWSData(message);
          IoCResolveServer<Promise<void>>("thread.postMsg")(msg.data.gId, msg);
        });
        ws.on("close", () => {
          console.log("Client disconnected");
          conReg.remove(getClientId(a));
        });
        res(true);
      });

      wss.on("error", rej);
    });
  }
}
