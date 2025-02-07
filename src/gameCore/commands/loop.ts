import { ICommand } from "../../common/ICommand";
import { CommandMoveTo } from "../../games/SpaceBattle/commands/CommandMoveTo";
import { CommandRun } from "../../games/SpaceBattle/commands/CommandRun";
import { getCoreCmd } from "../CoreCmd";
import { makeExceptionHadlerContextCmd } from "../ExceptionHandlerCmd/ExceptionHandlerCmd";
export const log: unknown[] = [];

let isGameLoopActive = false;

class MoveToState {
  constructor(readonly parent: CommandLoopRun) {}
  do(cmd: ICommand) {
    if (cmd.constructor.name === CommandRun.name) {
      this.changeState();
    } else {
      console.log("MoveToState");
      log.push("MoveToState");
      cmd.execute();
    }
  }
  changeState() {
    this.parent.state = new RegularState(this.parent);
  }
}

class RegularState {
  constructor(readonly parent: CommandLoopRun) {}
  do(cmd: ICommand) {
    if (cmd.constructor.name === CommandMoveTo.name) {
      this.changeState();
    } else {
      console.log("RegularState");
      log.push("RegularState");
      cmd.execute();
    }
  }
  changeState() {
    this.parent.state = new MoveToState(this.parent);
  }
}

export class CommandLoopRun implements ICommand {
  state: RegularState = new RegularState(this);

  async execute() {
    const core = getCoreCmd();
    const { cmdExceptionHandler, cmdQueue } = core.config;
    while (isGameLoopActive) {
      const cmd = cmdQueue.dequeue();
      try {
        if (cmd) {
          this.state.do(cmd);
        } else {
          await new Promise((res) => setTimeout(res, 10));
        }
      } catch (error) {
        cmdExceptionHandler.handle(makeExceptionHadlerContextCmd(cmd, error));
      }
    }
  }
}

export class CommandLoopStart implements ICommand {
  execute() {
    isGameLoopActive = true;
  }
}
export class CommandLoopStop implements ICommand {
  execute() {
    isGameLoopActive = false;
    log.push("hard stop");
  }
}

export class CommandGameLoopStopSoft implements ICommand {
  execute() {
    new CommandLoopStop().execute();
    const core = getCoreCmd();
    const { cmdExceptionHandler, cmdQueue } = core.config;
    while (!cmdQueue.isEmpty()) {
      const cmd = cmdQueue.dequeue();
      try {
        cmd.execute();
      } catch (error) {
        cmdExceptionHandler.handle(makeExceptionHadlerContextCmd(cmd, error));
      }
    }
    log.push("soft stop");
  }
}
