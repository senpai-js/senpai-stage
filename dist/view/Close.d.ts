import { SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface IClose extends ISprite {
}
export interface ICloseProps extends ISpriteProps {
}
export declare class Close extends Sprite implements IClose {
    readonly type: SpriteType;
    constructor(props: ICloseProps);
    update(): void;
}
