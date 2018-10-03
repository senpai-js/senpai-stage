import { IInteractionPoint, IPlayable } from "../util";
import { ISprite } from "./Sprite";
export interface IContainer {
    sprites: ISprite[];
    playables: IPlayable[];
    points: IInteractionPoint[];
    audioContext: AudioContext;
    addSprite(sprite: ISprite): this;
    removeSprite(sprite: ISprite): this;
    addPlayable(sprite: IPlayable): this;
    removePlayable(sprite: IPlayable): this;
    addPoint(point: IInteractionPoint): this;
    removePoint(point: IInteractionPoint): this;
    getSpriteByID(id: string): ISprite | null;
    getPlayableByID(id: string): IPlayable | null;
    getPointByID(id: string): IInteractionPoint | null;
}
export interface IContainerProps {
    audioContext: AudioContext;
}
export declare class Container implements IContainer {
    sprites: ISprite[];
    playables: IPlayable[];
    points: IInteractionPoint[];
    audioContext: AudioContext;
    constructor(props: IContainerProps);
    addSprite(sprite: ISprite): this;
    removeSprite(sprite: ISprite): this;
    addPlayable(sprite: IPlayable): this;
    removePlayable(sprite: IPlayable): this;
    addPoint(point: IInteractionPoint): this;
    removePoint(point: IInteractionPoint): this;
    getSpriteByID(id: string): ISprite;
    getPointByID(id: string): IInteractionPoint;
    getPlayableByID(id: string): IPlayable;
}
