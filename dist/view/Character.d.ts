import { ISprite, ISpriteProps, Sprite } from "./Sprite";
export interface ICharacterProps extends ISpriteProps {
    name: string;
    displayName: string;
    color: string;
}
export interface ICharacter extends ISprite {
    name: string;
    displayName: string;
    color: string;
}
export declare class Character extends Sprite implements ICharacter {
    name: string;
    displayName: string;
    color: string;
    constructor(props: ICharacterProps);
}
export interface ILoadCharacterProps extends ICharacterProps {
}
