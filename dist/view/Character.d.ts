import { SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ICharacterProps extends ISpriteProps {
    displayName: string;
    color: string;
}
export interface ICharacter extends ISprite {
    displayName: string;
    color: string;
}
export declare class Character extends Sprite implements ICharacter {
    readonly type: SpriteType;
    name: string;
    displayName: string;
    color: string;
    constructor(props: ICharacterProps);
}
