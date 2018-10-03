import { IInteractionPoint, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface IPanel extends ISprite {
    addSprite(sprite: ISprite): this;
    removeSprite(sprite: ISprite): this;
    focus(sprite: ISprite): void;
}
export interface IPanelProps extends ISpriteProps {
}
export declare class Panel extends Sprite implements IPanel {
    readonly type: SpriteType;
    private sprites;
    constructor(props: IPanelProps);
    addSprite(sprite: ISprite): this;
    interpolate(now: number): void;
    removeSprite(sprite: ISprite): this;
    broadPhase(point: IInteractionPoint): boolean;
    narrowPhase(point: IInteractionPoint): ISprite;
    update(): void;
    render(ctx: CanvasRenderingContext2D): void;
    focus(target: ISprite): void;
    isFocused(): ISprite;
    skipAnimation(now: number): boolean;
}
