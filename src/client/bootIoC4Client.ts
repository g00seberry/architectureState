import { CommandIoCBootstrap, IoC } from "../IoC/IoC";
import { IoCDependencyContainer } from "../IoC/IoCDependencyContainer";
import { IoCResolveStrategyStd } from "../IoC/IoCResolveStrategyStd";
import { IoCScopeTreeContainer } from "../IoC/IoCScopeTreeContainer";
import { IoCDependencyFn } from "../IoC/types";
import { GameMessage } from "../types";
import { entityMove } from "./api/entity";
import { runGame } from "./api/game";
import { GameAuthInfo } from "./api/types";
import { CommandAuthInGame } from "./commands/CommandAuthInGame";
import { CommandSendGameMessage } from "./commands/CommandSendGameMessage";
import { createConnectionWithServer } from "./createConnectionWithServer";

export const IoCResolveClient = <T>(
  dependencyName: string
): IoCDependencyFn<T> => IoC.resolve<T>(dependencyName);

export const bootIoC4Client = () => {
  new CommandIoCBootstrap(
    new IoCScopeTreeContainer(new IoCDependencyContainer(), "root"),
    new IoCResolveStrategyStd()
  ).execute();

  IoCResolveClient("register")("game.auth", (data: GameAuthInfo) =>
    new CommandAuthInGame(data).execute()
  );

  IoCResolveClient("register")("connection.init", () =>
    createConnectionWithServer()
  );

  IoCResolveClient("register")("game.run", (id: string) => runGame(id));

  IoCResolveClient("register")("game.message", (data: GameMessage) =>
    new CommandSendGameMessage(data).execute()
  );

  IoCResolveClient("register")("api.entity.move", (eId: string, gId: string) =>
    entityMove(eId, gId)
  );
};
