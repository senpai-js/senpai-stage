import { Cursor, SpriteType, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface IButton extends ISprite {
    selected: boolean;
    font: string;
    fontColor: string;
    fontSize: number;
    text: string;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    setText(text: string): this;
}
export interface IButtonProps extends ISpriteProps {
    selected?: boolean;
    font?: string;
    fontColor?: string;
    fontSize?: number;
    text?: string;
    textAlign?: TextAlign;
    textBaseline?: TextBaseline;
}
export declare class Button extends Sprite implements IButton {
    readonly type: SpriteType;
    selected: boolean;
    font: string;
    fontColor: string;
    fontSize: number;
    text: string;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    cursor: Cursor;
    constructor(props: IButtonProps);
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    setText(text: string): this;
}
