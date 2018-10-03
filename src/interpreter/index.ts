import { EventEmitter, IQuitEvent } from "../events";
import { Stage } from "../view/Stage";

export interface IInterpreter {
  link(scripts: IScriptIndex): this;
  openDialog(name: string): Promise<DialogResult>;
  newGame(): void;
  getFlag(flag: string): JournalValue;
  setFlag(flag: string, value: JournalValue): JournalValue;
  addJournalEntry(name: string, ...props: JournalValue[]): void;
  advance(): void;
  previous(): void;
}

export type JournalValue = number | string | boolean | null;

export enum DialogResult {
  Abort = "Abort",
  Cancel = "Cancel",
  Ignore = "Ignore",
  No = "No",
  None = "None",
  OK = "OK",
  Retry = "Retry",
  Yes = "Yes",
}

export enum JournalActionType {
  Jump,
  End,
  DialogResult,
  NewGame,
  Quit,
  History,
}

export interface IScriptIndex {
  [name: string]: (i: IInterpreter) => Promise<IJournalAction>;
}

export interface IJournalAction {
  target: string;
  type: JournalActionType;
}

export function jump(name: string): IJournalAction {
  return {
    target: name,
    type: JournalActionType.Jump,
  };
}

export function end(): IJournalAction {
  return {
    target: null,
    type: JournalActionType.End,
  };
}

export function newStory(): IJournalAction {
  return {
    target: null,
    type: JournalActionType.NewGame,
  };
}

export function closeDialog(result: DialogResult): IJournalAction {
  return {
    target: result,
    type: JournalActionType.DialogResult,
  };
}

export function quit(): IJournalAction {
  return {
    target: null,
    type: JournalActionType.Quit,
  };
}

export enum InterpreterState {
  Dialog,
  Story,
  MainMenu,
}

interface IJournalData {
  [key: string]: JournalValue;
}

interface IJournalEntry {
  name: string;
  data: IJournalData;
}

export class Interpreter extends Stage implements IInterpreter {
  public interpreterState: InterpreterState = InterpreterState.MainMenu;
  public quitEvent: EventEmitter<IQuitEvent> = new EventEmitter<IQuitEvent>();

  public persist: IJournalData = {};
  public data: IJournalData = {};
  private flags: IJournalData = {};

  private scripts: IScriptIndex = {};
  private journal: IJournalEntry[] = [];
  private journalIndex: number = -1;

  private states: IJournalStates[] = [];

  public link(scripts: IScriptIndex) {
    Object.assign(this.scripts, scripts);
    return this;
  }

  public async openDialog(name: string): Promise<DialogResult> {
    const script = this.scripts[name];

    if (!script) {
      throw new Error("Dialog script not found or linked: " + name + ".");
    }
    this.interpreterState = InterpreterState.Dialog;

    const result = await script(this);

    if (!result) {
      return DialogResult.None;
    }

    if (result.type === JournalActionType.Quit) {
      this.quitEvent.emit({
        eventType: "Quit",
        source: this,
        stage: this,
      });
      return DialogResult.None;
    }

    if (result.type === JournalActionType.DialogResult) {
      return result.target as DialogResult;
    }

    if (result.type === JournalActionType.NewGame) {
      this.newGame();
      return DialogResult.None;
    }

    throw new Error("Invalid dialog return type: " + result.type + ".");
  }

  public getFlag(flag: string): JournalValue {
    if (this.flags.hasOwnProperty(flag)) {
      return this.flags[flag];
    }
    throw new Error(`Cannot get flag ${flag} because it's not set.`);
  }

  public setFlag(flag: string, value: JournalValue): JournalValue {
    if (this.flags.hasOwnProperty(flag)) {
      return this.getFlag(flag);
    }
    return this.flags[flag] = value;
  }

  public newGame(): void {
    this.flags = {};
    this.data = {};
    this.journal = [];
    this.journalIndex = -1;
    this.states = [];
    this.stateIndex = 0;
    this.interpreterState = InterpreterState.Story;
    this.addJournalEntry("index");
    this.advance();
  }

  public advance(): void {
    if (this.interpreterState === InterpreterState.Story) {

    }
  }
}
