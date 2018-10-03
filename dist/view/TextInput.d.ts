import { IKeyDownEvent } from "../events";
import { IPadding, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export declare enum SelectionState {
    Selection = 0,
    Caret = 1
}
export interface ITextInput extends ISprite {
    text: string;
    font: string;
    fontSize: number;
    fontColor: string;
    selectionState: SelectionState;
    caretIndex: number;
    selectionEnd: number;
    caretX: number;
    padding: IPadding;
    frameCount: number;
    setText(text: string): this;
}
export interface ITextInputProps extends ISpriteProps {
    text?: string;
    font?: string;
    fontSize?: number;
    fontColor?: string;
    width: number;
    height: number;
}
export declare class TextInput extends Sprite implements ITextInput {
    readonly type: SpriteType;
    text: string;
    font: string;
    fontSize: number;
    fontColor: string;
    caretIndex: number;
    caretX: number;
    textScroll: number;
    selectionState: SelectionState;
    padding: IPadding;
    selectionEnd: number;
    frameCount: number;
    private showCaret;
    private activeMidPattern;
    private inactiveMidPattern;
    constructor(props: ITextInputProps);
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    setText(text: string): this;
    keyDown(e: IKeyDownEvent): void;
}
