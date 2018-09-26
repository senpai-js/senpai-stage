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
  started: number; // timestamp when the media last began playing
  length: number; // media play length timespan
  start: number; // media start time
  end: number; // media end time
  loop: boolean; // does this media loop?
  state: PlayState; // self explainatory
  loaded: Promise<void>; // this should be a promise that resolves once the audio has loaded
  play(): this;
  pause(): this;
  stop(): this;
  setVolume(volume: number); // accepts number [0. 1]
}

export interface IAudio extends IPlayable {
  gain: GainNode; // controls volume
  source: AudioBuffer; // is null until the audioBuffer is loaded
  destination: AudioNode;
  definition: ISoundSpriteSheet; // this will be the provided sound sprite sheet
  context: AudioContext; // provided audio context for creating the sound sprite
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
  definition: ISoundSpriteSheet; // this will be the provided sound sprite sheet
  context: AudioContext; // provided audio context for creating the sound sprite
  name: string; // determines the name of the audio clip
}

export interface IPlayableProps {
  source: Promise<Response>;
  texture: string; // this should be name of the texture in the spritesheet
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
export function zSort(left: ISprite, right: ISprite): number {
  return left.z - right.z;
}

export enum TextAlign {
  "left" = "left",
  "right" = "right",
  "center" = "center",
  "start" = "start",
  "end" = "end",
}

export enum TextBaseline {
  "top" = "top",
  "hanging" = "hanging",
  "middle" = "middle",
  "alphabetic" = "alphabetic",
  "ideographic" = "ideographic",
  "bottom" = "bottom",
}

export enum PlayState {
  Playing,
    Paused,
    Stopped,
}

export enum Cursor {
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
  "grabbing" = "grabbing",
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
