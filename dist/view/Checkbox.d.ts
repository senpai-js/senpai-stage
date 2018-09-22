import { EventEmitter, IValueChangeEvent } from "../events";
import { IInteractionPoint, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ICheckbox extends ISprite {
    checked: boolean;
    text: string;
    font: string;
    fontColor: string;
    fontSize: number;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    toggleEvent: EventEmitter<IValueChangeEvent<boolean>>;
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
    checked: boolean;
    text: string;
    font: string;
    fontColor: string;
    fontSize: number;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    toggleEvent: EventEmitter<IValueChangeEvent<boolean>>;
    constructor(props: ICheckboxProps);
    toggle(): this;
    pointCollision(point: IInteractionPoint): boolean;
    render(ctx: CanvasRenderingContext2D): void;
    update(): void;
    setText(text: string): this;
}
export interface ILoadCheckboxProps extends ICheckboxProps {
}
