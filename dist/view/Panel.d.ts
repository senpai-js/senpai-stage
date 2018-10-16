import { IInteractionPoint, IPadding, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface IPanel extends ISprite {
    padding: IPadding;
    addSprite(sprite: ISprite): this;
    removeSprite(sprite: ISprite): this;
    focus(sprite: ISprite): void;
}
export interface IPanelProps extends ISpriteProps {
    padding?: IPadding;
    width: number;
    height: number;
}
export declare class Panel extends Sprite implements IPanel {
    readonly type: SpriteType;
    padding: IPadding;
    private sprites;
    private bottomCenterPattern;
    private topCenterPattern;
    private middleLeftPattern;
    private middleRightPattern;
    private middleCenterPattern;
    constructor(props: IPanelProps);
    addSprite(sprite: ISprite): this;
    interpolate(now: number): void;
    isHovering(point: IInteractionPoint, now: number): ISprite;
    narrowPhase(point: IInteractionPoint): ISprite;
    removeSprite(sprite: ISprite): this;
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    focus(target: ISprite): void;
    isFocused(): ISprite;
    skipAnimation(now: number): boolean;
}
