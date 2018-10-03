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
export declare type JournalValue = number | string | boolean | null;
export declare enum DialogResult {
    Abort = "Abort",
    Cancel = "Cancel",
    Ignore = "Ignore",
    No = "No",
    None = "None",
    OK = "OK",
    Retry = "Retry",
    Yes = "Yes"
}
export declare enum JournalActionType {
    Jump = 0,
    End = 1,
    DialogResult = 2,
    NewGame = 3,
    Quit = 4,
    History = 5
}
export interface IScriptIndex {
    [name: string]: (i: IInterpreter) => Promise<IJournalAction>;
}
export interface IJournalAction {
    target: string;
    type: JournalActionType;
}
export declare function jump(name: string): IJournalAction;
export declare function end(): IJournalAction;
export declare function newStory(): IJournalAction;
export declare function closeDialog(result: DialogResult): IJournalAction;
export declare function quit(): IJournalAction;
export declare enum InterpreterState {
    Dialog = 0,
    Story = 1,
    MainMenu = 2
}
interface IJournalData {
    [key: string]: JournalValue;
}
export declare class Interpreter extends Stage implements IInterpreter {
    interpreterState: InterpreterState;
    quitEvent: EventEmitter<IQuitEvent>;
    persist: IJournalData;
    data: IJournalData;
    private flags;
    private scripts;
    private journal;
    private journalIndex;
    private states;
    link(scripts: IScriptIndex): this;
    openDialog(name: string): Promise<DialogResult>;
    getFlag(flag: string): JournalValue;
    setFlag(flag: string, value: JournalValue): JournalValue;
    newGame(): void;
    advance(): void;
}
export {};
