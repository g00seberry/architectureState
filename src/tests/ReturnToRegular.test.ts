import {
  bootIoC4GameCore,
  IoCResolveGameCore,
} from "../gameCore/bootIoC4GameCore";
import { CommandLog, SimpleLogger } from "../gameCore/commands";
import { log } from "../gameCore/commands/loop";
import { CommandMoveTo } from "../games/SpaceBattle/commands/CommandMoveTo";
import { CommandRun } from "../games/SpaceBattle/commands/CommandRun";
import { CommandIoCBootstrap } from "../IoC/IoC";
import { IoCDependencyContainer } from "../IoC/IoCDependencyContainer";
import { IoCResolveStrategyStd } from "../IoC/IoCResolveStrategyStd";
import { IoCScopeTreeContainer } from "../IoC/IoCScopeTreeContainer";

new CommandIoCBootstrap(
  new IoCScopeTreeContainer(new IoCDependencyContainer(), "root"),
  new IoCResolveStrategyStd()
).execute();

bootIoC4GameCore();

test("test MoveTo", async () => {
  await new Promise((res, rej) => {
    IoCResolveGameCore<Promise<void>>("core.init")().then(() => {
      IoCResolveGameCore("loop.start")();
      IoCResolveGameCore("loop.run")();
      IoCResolveGameCore("cmdQueue.push")(
        new CommandLog(new SimpleLogger()).log(2)
      );
      IoCResolveGameCore("cmdQueue.push")(new CommandMoveTo());
      IoCResolveGameCore("cmdQueue.push")(
        new CommandLog(new SimpleLogger()).log(2)
      );
      IoCResolveGameCore("cmdQueue.push")(
        new CommandLog(new SimpleLogger()).log(2)
      );
      IoCResolveGameCore("cmdQueue.push")(new CommandRun());
      IoCResolveGameCore("cmdQueue.push")(
        new CommandLog(new SimpleLogger()).log(2)
      );
      setTimeout(res, 4000);
    });
  });
  expect(log).toEqual([
    "RegularState",
    "MoveToState",
    "MoveToState",
    "RegularState",
  ]);
});
