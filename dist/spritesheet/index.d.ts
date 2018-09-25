export interface ISpriteSheet {
    kind: SpriteSheetKind;
}
export declare enum SpriteSheetKind {
    JSON = 0,
    JSON_TP_Hash = 1,
    JSON_TP_Array = 2
}
export interface ISpriteSheetPosition {
    x: number;
    y: number;
}
export interface ISpriteSheetName {
    name: string;
}
export interface ISpriteSheetSize {
    width: number;
    height: number;
}
export interface ISpriteSheetSizeShort {
    w: number;
    h: number;
}
export interface ISpriteSheetRotated {
    rotated: boolean;
}
export interface ISpriteSheetTrimmed {
    trimmed: boolean;
}
export interface ISpriteSheetSourceSize {
    spriteSourceSize: ISpriteSheetPosition & ISpriteSheetSizeShort;
}
export interface ISpriteSheetMeta {
    app: string;
    version: string;
    image: string;
    size: ISpriteSheetSizeShort;
    scale: number;
}
export interface ISpriteSheetJSONHash extends ISpriteSheet {
    kind: SpriteSheetKind.JSON_TP_Hash;
    frames: {
        [frame: string]: ISpriteSheetPosition & ISpriteSheetSizeShort & ISpriteSheetRotated & ISpriteSheetTrimmed & ISpriteSheetSourceSize;
    };
    meta: ISpriteSheetMeta;
}
export interface ISpriteSheetFileName {
    filename: string;
}
export interface ISpriteSheetJSONArray extends ISpriteSheet {
    kind: SpriteSheetKind.JSON_TP_Array;
    frames: Array<ISpriteSheetPosition & ISpriteSheetSizeShort & ISpriteSheetRotated & ISpriteSheetTrimmed & ISpriteSheetSourceSize & ISpriteSheetFileName>;
    meta: ISpriteSheetMeta;
}
export interface ISpriteSheetFrame {
    frame: ISpriteSheetPosition & ISpriteSheetSizeShort;
}
export interface ISpriteSheetJSON extends ISpriteSheet, Iterable<ISpriteSheetName & ISpriteSheetPosition & ISpriteSheetSize> {
    kind: SpriteSheetKind.JSON;
    [key: number]: ISpriteSheetName & ISpriteSheetPosition & ISpriteSheetSize;
    length: number;
}
export interface IJSONSpriteSheet extends ISpriteSheet {
    kind: SpriteSheetKind.JSON_TP_Array;
    frames: Array<ISpriteSheetFileName & ISpriteSheetFrame & ISpriteSheetRotated & ISpriteSheetTrimmed & ISpriteSheetSourceSize & {
        sourceSize: ISpriteSheetSizeShort;
    }>;
    meta: ISpriteSheetMeta;
}
export declare function loadSpriteSheet(url: string | Request, opts?: RequestInit): Promise<ISpriteSheet>;
export interface ITextureMap {
    [texture: string]: ImageBitmap;
}
export declare function createTextureMap(definitionPromise: Promise<ISpriteSheet>, imgPromise: Promise<ImageBitmap>): Promise<ITextureMap>;
export declare function loadImage(url: string | Request, opts?: RequestInit): Promise<ImageBitmap>;
