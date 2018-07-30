import { IInteractionPoint } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ISlider extends ISprite {
    value: number;
    max: number;
    min: number;
    width: number;
}
export interface ISliderProps extends ISpriteProps {
    value?: number;
    max?: number;
    min?: number;
    width: number;
}
export declare class Slider extends Sprite implements ISlider {
    value: number;
    max: number;
    min: number;
    width: number;
    private sliderPattern;
    private pillTexture;
    constructor(props: ISliderProps);
    broadPhase(point: IInteractionPoint): boolean;
    narrowPhase(point: IInteractionPoint): ISprite;
    pointCollision(point: IInteractionPoint): boolean;
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
}
export interface ILoadSliderProps extends ISliderProps {
}
