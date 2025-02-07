import { bootIoC4Client, IoCResolveClient } from "./client/bootIoC4Client";
import { GameMessage } from "./types";

bootIoC4Client();
const init = async () => {
  await IoCResolveClient<Promise<void>>("game.auth")({
    gId: "SpaceBattle",
    login: "test",
    pass: "123",
  });
  await IoCResolveClient<Promise<void>>("connection.init")();
  await IoCResolveClient<Promise<void>>("game.run")("SpaceBattle");
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandLog", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandLog", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandMoveTo", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandLog", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandLog", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandRun", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
  IoCResolveClient("game.message")({
    type: "std",
    data: { cmdName: "CommandLog", gId: "SpaceBattle", payload: "test" },
  } as GameMessage);
};

init();
