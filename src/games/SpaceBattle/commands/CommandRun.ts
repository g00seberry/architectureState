import { ICommand } from "../../../common/ICommand";

export class CommandRun implements ICommand {
  execute: () => void;
}
