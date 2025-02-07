import { parentPort } from "node:worker_threads";
import {
  bootIoC4GameCore,
  IoCResolveGameCore,
} from "../../gameCore/bootIoC4GameCore";
import { CommandIoCBootstrap } from "../../IoC/IoC";
import { IoCDependencyContainer } from "../../IoC/IoCDependencyContainer";
import { IoCResolveStrategyStd } from "../../IoC/IoCResolveStrategyStd";
import { IoCScopeTreeContainer } from "../../IoC/IoCScopeTreeContainer";
import { postBack } from "./postBack";
import { StrategyInterpretCmd } from "./strategies/StrategyInterpretCmd";

new CommandIoCBootstrap(
  new IoCScopeTreeContainer(new IoCDependencyContainer(), "root"),
  new IoCResolveStrategyStd()
).execute();

bootIoC4GameCore();
const interpreter = new StrategyInterpretCmd();

IoCResolveGameCore<Promise<void>>("core.init")().then(() => {
  postBack("inited");
  IoCResolveGameCore("loop.start")();
  IoCResolveGameCore("loop.run")();
  parentPort?.on("message", (msg: string) => {
    try {
      const cmd = interpreter.bind(JSON.parse(msg)).execute();
      if (cmd) IoCResolveGameCore("cmdQueue.push")(cmd);
    } catch (error) {
      console.error(error);
    }
  });
});
