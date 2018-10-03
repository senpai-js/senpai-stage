import { EventEmitter, IValueChangeEvent } from "../events";
import { IInteractionPoint, SpriteType, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ICheckbox extends ISprite {
    checked: boolean;
    text: string;
    font: string;
    fontColor: string;
    fontSize: number;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    checkedChangeEvent: EventEmitter<IValueChangeEvent<boolean>>;
    setText(text: string): this;
    toggle(): this;
}
export interface ICheckboxProps extends ISpriteProps {
    checked?: boolean;
    text?: string;
    font?: string;
    fontColor?: string;
    fontSize?: number;
    textAlign?: TextAlign;
    textBaseline?: TextBaseline;
}
export declare class Checkbox extends Sprite implements ICheckbox {
    readonly type: SpriteType;
    checked: boolean;
    text: string;
    font: string;
    fontColor: string;
    fontSize: number;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    checkedChangeEvent: EventEmitter<IValueChangeEvent<boolean>>;
    constructor(props: ICheckboxProps);
    toggle(): this;
    pointCollision(point: IInteractionPoint): boolean;
    render(ctx: CanvasRenderingContext2D): void;
    update(): void;
    setText(text: string): this;
}
