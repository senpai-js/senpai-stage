import { ISprite } from "../view/Sprite";
export interface IPoint {
    x: number;
    y: number;
}
export interface ISpriteSheet {
    frames: ISpriteSheetFrameMap;
    meta: ISpriteSheetMeta;
}
export interface ISpriteSheetFrameMap {
    [frame: string]: ISpriteSheetFrame;
}
export interface ISpriteSheetMeta {
    app: string;
    version: string;
    image: string;
    size: ISpriteSheetSize;
    scale: number;
}
export interface ISpriteSheetFrame {
    frame: ISpriteSheetPoint & ISpriteSheetSize;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: ISpriteSheetPoint & ISpriteSheetSize;
    sourceSize: ISpriteSheetSize;
}
export interface ISpriteSheetSize {
    w: number;
    h: number;
}
export interface ISpriteSheetPoint {
    x: number;
    y: number;
}
export interface ITextureMap {
    [texture: string]: ImageBitmap;
}
export interface IInteractionPoint extends IPoint {
    id: string;
    type: "Touch" | "Mouse";
    down: boolean;
    clicked: boolean;
    captured: boolean;
    active: ISprite;
    hover: ISprite;
    firstDown: boolean;
    tx: number;
    ty: number;
}
export interface IPlayable {
    started: number;
    length: number;
    start: number;
    end: number;
    loop: boolean;
    state: PlayState;
    loaded: Promise<void>;
    play(): this;
    pause(): this;
    stop(): this;
    setVolume(volume: number): any;
}
export interface IAudio extends IPlayable {
    gain: GainNode;
    source: AudioBuffer;
    destination: AudioNode;
    definition: ISoundSpriteSheet;
    context: AudioContext;
}
export interface ISoundSpriteSheet {
    resources: string[];
    spritemap: {
        [name: string]: ISoundSpriteSheetTexture;
    };
}
export interface ISoundSpriteSheetTexture {
    start: number;
    end: number;
    loop: boolean;
}
export interface IAudioProps extends IPlayableProps {
    definition: ISoundSpriteSheet;
    context: AudioContext;
    name: string;
}
export interface IPlayableProps {
    source: Promise<Response>;
    texture: string;
}
export interface IKeyState {
    key: string;
    down: boolean;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IPadding {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export declare function createTextureMap(definition: ISpriteSheet, img: Promise<ImageBitmap>): Promise<ITextureMap>;
export declare function loadImage(src: string): Promise<ImageBitmap>;
export declare function zSort(left: ISprite, right: ISprite): number;
export declare enum TextAlign {
    "left" = "left",
    "right" = "right",
    "center" = "center",
    "start" = "start",
    "end" = "end"
}
export declare enum TextBaseline {
    "top" = "top",
    "hanging" = "hanging",
    "middle" = "middle",
    "alphabetic" = "alphabetic",
    "ideographic" = "ideographic",
    "bottom" = "bottom"
}
export declare enum PlayState {
    Playing = 0,
    Paused = 1,
    Stopped = 2
}
