/// <reference types="node" />
import { EventEmitter } from "events";
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
}
export interface IContainerProps {
    audioContext: AudioContext;
}
export declare class Container extends EventEmitter implements IContainer {
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
}
