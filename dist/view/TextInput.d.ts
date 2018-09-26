import { SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ITextInput extends ISprite {
    text: string;
    font: string;
    fontSize: number;
    fontColor: string;
    caretIndex: number;
    caretX: number;
    selection: [number, number];
    textScroll: number;
    padding: [number, number, number, number];
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
    selection: [number, number];
    textScroll: number;
    padding: [number, number, number, number];
    frameCount: number;
    private showCaret;
    constructor(props: ITextInputProps);
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    setText(text: string): this;
}
