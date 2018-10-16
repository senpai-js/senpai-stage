import { IKeyDownEvent, IKeyPressEvent } from "../events";
import { Cursor, IInteractionPoint, IPadding, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export declare enum SelectionState {
    Selection = 0,
    Caret = 1
}
export interface ITextInput extends ISprite {
    text: string[];
    font: string;
    fontSize: number;
    fontColor: string;
    selectedFontColor: string;
    selectedFontBackgroundColor: string;
    selectionState: SelectionState;
    caretIndex: number;
    selectionStart: number;
    selectionEnd: number;
    caretX: number;
    padding: IPadding;
    frameCount: number;
    textScroll: number;
    showCaret: boolean;
    setText(text: string): this;
    select(begin: number, end: number): this;
}
export interface ITextInputProps extends ISpriteProps {
    text?: string;
    font?: string;
    fontSize?: number;
    fontColor?: string;
    selectedFontColor?: string;
    selectedFontBackgroundColor?: string;
    width: number;
}
export declare class TextInput extends Sprite implements ITextInput {
    readonly type: SpriteType;
    text: string[];
    font: string;
    fontSize: number;
    fontColor: string;
    selectedFontColor: string;
    selectedFontBackgroundColor: string;
    caretIndex: number;
    caretX: number;
    textScroll: number;
    selectionState: SelectionState;
    padding: IPadding;
    selectionEnd: number;
    selectionStart: number;
    frameCount: number;
    cursor: Cursor;
    parentHoverCheck: boolean;
    showCaret: boolean;
    private focusedMidPattern;
    private unfocusedMidPattern;
    constructor(props: ITextInputProps);
    broadPhase(point: IInteractionPoint): boolean;
    narrowPhase(point: IInteractionPoint): ISprite;
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    setText(text: string): this;
    keyDown(e: IKeyDownEvent): void;
    keyPress(e: IKeyPressEvent): void;
    select(begin: number, end: number): this;
    pointCollision(point: IInteractionPoint): boolean;
    private keyPressCaret;
    private keyDownCaret;
    private keyPressCaretInsert;
    private keyDownCaretInsert;
    private keyPressSelection;
    private keyDownSelection;
    private renderCaret;
    private renderSelection;
    private renderCaretInsert;
    private moveCaretLeft;
    private moveCaretRight;
    private getCaretIndex;
}
