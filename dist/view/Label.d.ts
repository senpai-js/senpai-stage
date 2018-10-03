import { SpriteType, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ILabel extends ISprite {
    text: string;
    font: string;
    fontSize: number;
    fontColor: string;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    setText(text: string): this;
}
export interface ILabelProps extends ISpriteProps {
    text?: string;
    font?: string;
    fontSize?: number;
    fontColor?: string;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
}
export declare class Label extends Sprite implements ILabel {
    readonly type: SpriteType;
    text: string;
    font: string;
    fontSize: number;
    fontColor: string;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    constructor(props: ILabelProps);
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    setText(text: string): this;
}
