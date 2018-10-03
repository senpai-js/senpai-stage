export interface ISpriteSheet {
    kind: SpriteSheetKind;
}
export declare enum SpriteSheetKind {
    JSON = 0,
    JSON_TP_Hash = 1,
    JSON_TP_Array = 2
}
export interface ISpriteSheetPoint {
    x: number;
    y: number;
}
export interface ISpriteSheetSizeShort {
    w: number;
    h: number;
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
        [frame: string]: {
            frame: ISpriteSheetPoint & ISpriteSheetSizeShort;
            rotated: boolean;
            trimmed: boolean;
            spriteSourceSize: ISpriteSheetPoint & ISpriteSheetSizeShort;
            sourceSize: ISpriteSheetSizeShort;
        };
    };
    meta: ISpriteSheetMeta;
}
export interface ISpriteSheetFileName {
    filename: string;
}
export interface ISpriteSheetJSONArray extends ISpriteSheet {
    kind: SpriteSheetKind.JSON_TP_Array;
    frames: Array<{
        filename: string;
        frame: ISpriteSheetPoint & ISpriteSheetSizeShort;
        rotated: boolean;
        trimmed: boolean;
        spriteSourceSize: ISpriteSheetPoint & ISpriteSheetSizeShort;
        sourceSize: ISpriteSheetSizeShort;
    }>;
    meta: ISpriteSheetMeta;
}
export declare type ISpriteSheetJSON = Array<{
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}> & {
    kind: SpriteSheetKind.JSON;
};
export declare function loadSpriteSheet(url: string | Request, opts?: RequestInit): Promise<ISpriteSheet>;
export declare function createSpriteSheet(definition: any): ISpriteSheet;
export interface ITextureMap {
    [texture: string]: ImageBitmap;
}
export declare function createTextureMap(definitionPromise: Promise<ISpriteSheet>, imgPromise: Promise<ImageBitmap>): Promise<ITextureMap>;
export declare function loadImage(url: string | Request, opts?: RequestInit): Promise<ImageBitmap>;
