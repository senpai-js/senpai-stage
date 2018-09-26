import { IPadding, SpriteType, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ITextbox extends ISprite {
    text: string;
    textSpeed: number;
    textIndex: number;
    padding: IPadding;
    fontSize: number;
    font: string;
    fontColor: string;
    lineHeight: number;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    setText(text: string): this;
    appendText(text: string): this;
}
export interface ITextboxProps extends ISpriteProps {
    text?: string;
    textSpeed?: number;
    textIndex?: number;
    textAlign?: TextAlign;
    textBaseline?: TextBaseline;
    padding?: IPadding;
    fontSize?: number;
    font?: string;
    fontColor?: string;
    lineHeight?: number;
}
export declare class Textbox extends Sprite implements ITextbox {
    private static regex;
    readonly type: SpriteType;
    text: string;
    textSpeed: number;
    textIndex: number;
    padding: IPadding;
    fontSize: number;
    font: string;
    fontColor: string;
    lineHeight: number;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    private interpolatedText;
    constructor(props: ITextboxProps);
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    setText(text: string): this;
    appendText(text: string): this;
    skipAnimation(now: number): boolean;
}
