import { ISprite } from "../view/Sprite";
export interface IPoint {
    x: number;
    y: number;
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
    id: string;
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
    id: string;
    source: Promise<Response>;
    texture: string;
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
/**
 * Sort by z level in ascending order.
 */
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
export declare enum Cursor {
    "auto" = "auto",
    "default" = "default",
    "none" = "none",
    "context-menu" = "context-menu",
    "help" = "help",
    "pointer" = "pointer",
    "progress" = "progress",
    "wait" = "wait",
    "cell" = "cell",
    "crosshair" = "crosshair",
    "text" = "text",
    "vertical-text" = "vertical-text",
    "alias" = "alias",
    "copy" = "copy",
    "move" = "move",
    "no-drop" = "no-drop",
    "not-allowed" = "not-allowed",
    "e-resize" = "e-resize",
    "n-resize" = "n-resize",
    "ne-resize" = "ne-resize",
    "nw-resize" = "nw-resize",
    "s-resize" = "s-resize",
    "se-resize" = "se-resize",
    "sw-resize" = "sw-resize",
    "w-resize" = "w-resize",
    "ew-resize" = "ew-resize",
    "ns-resize" = "ns-resize",
    "nesw-resize" = "nesw-resize",
    "nwse-resize" = "nwse-resize",
    "col-resize" = "col-resize",
    "row-resize" = "row-resize",
    "all-scroll" = "all-scroll",
    "zoom-in" = "zoom-in",
    "zoom-out" = "zoom-out",
    "grab" = "grab",
    "grabbing" = "grabbing"
}
export interface ISpritePosition {
    x?: number;
    y?: number;
    s: number;
    sx?: number;
    sy?: number;
    r?: number;
    cx?: number;
    cy?: number;
}
export declare enum SpriteType {
    Button = 0,
    Character = 1,
    Checkbox = 2,
    Close = 3,
    Label = 4,
    Panel = 5,
    Slider = 6,
    Textbox = 7,
    TextInput = 8,
    Sprite = 9
}
