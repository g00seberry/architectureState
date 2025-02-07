import {
  bootIoC4GameCore,
  IoCResolveGameCore,
} from "../gameCore/bootIoC4GameCore";
import { CommandLog, SimpleLogger } from "../gameCore/commands";
import { CommandLoopStop, log } from "../gameCore/commands/loop";
import { CommandIoCBootstrap } from "../IoC/IoC";
import { IoCDependencyContainer } from "../IoC/IoCDependencyContainer";
import { IoCResolveStrategyStd } from "../IoC/IoCResolveStrategyStd";
import { IoCScopeTreeContainer } from "../IoC/IoCScopeTreeContainer";

new CommandIoCBootstrap(
  new IoCScopeTreeContainer(new IoCDependencyContainer(), "root"),
  new IoCResolveStrategyStd()
).execute();

bootIoC4GameCore();

test("test hard stop", async () => {
  await new Promise((res, rej) => {
    IoCResolveGameCore<Promise<void>>("core.init")().then(() => {
      IoCResolveGameCore("loop.start")();
      IoCResolveGameCore("loop.run")();
      IoCResolveGameCore("cmdQueue.push")(
        new CommandLog(new SimpleLogger()).log(2)
      );
      IoCResolveGameCore("cmdQueue.push")(new CommandLoopStop());
      setTimeout(res, 4000);
    });
  });
  expect(log).toEqual(["RegularState", "RegularState", "hard stop"]);
});
