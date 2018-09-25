export interface ISpriteSheet {
  kind: SpriteSheetKind;
}

export enum SpriteSheetKind {
  JSON,
  JSON_TP_Hash,
  JSON_TP_Array,
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
    [frame: string]: ISpriteSheetPosition
      & ISpriteSheetSizeShort
      & ISpriteSheetRotated
      & ISpriteSheetTrimmed
      & ISpriteSheetSourceSize;
  };
  meta: ISpriteSheetMeta;
}

export interface ISpriteSheetFileName {
  filename: string;
}

export interface ISpriteSheetJSONArray extends ISpriteSheet {
  kind: SpriteSheetKind.JSON_TP_Array;
  frames: Array<ISpriteSheetPosition
      & ISpriteSheetSizeShort
      & ISpriteSheetRotated
      & ISpriteSheetTrimmed
      & ISpriteSheetSourceSize
      & ISpriteSheetFileName>;
  meta: ISpriteSheetMeta;
}

export interface ISpriteSheetFrame {
  frame: ISpriteSheetPosition & ISpriteSheetSizeShort;
}

export interface ISpriteSheetJSON extends ISpriteSheet, Iterable<ISpriteSheetName
& ISpriteSheetPosition
& ISpriteSheetSize> {
  kind: SpriteSheetKind.JSON;
  [key: number]: ISpriteSheetName
    & ISpriteSheetPosition
    & ISpriteSheetSize;
  length: number;

}

export interface IJSONSpriteSheet extends ISpriteSheet {
  kind: SpriteSheetKind.JSON_TP_Array;
  frames: Array<
    ISpriteSheetFileName
    & ISpriteSheetFrame
    & ISpriteSheetRotated
    & ISpriteSheetTrimmed
    & ISpriteSheetSourceSize
    & {
      sourceSize: ISpriteSheetSizeShort;
    }
  >;
  meta: ISpriteSheetMeta;
}

export async function loadSpriteSheet(url: string | Request, opts?: RequestInit): Promise<ISpriteSheet> {
  const resp = await fetch(url, opts);
  const definition = await resp.json();

  if (Array.isArray(definition)) {
    const result: ISpriteSheetJSON = {
      kind: SpriteSheetKind.JSON,
      length: definition.length,
      [Symbol.iterator]: Array.prototype[Symbol.iterator],
    };
    for (let i = 0; i < definition.length; i++) {
      result[i] = definition[i];
    }
    return result;
  }
  if (!definition.frames) {
    throw new Error("Invalid spritesheet format.");
  }
  if (Array.isArray(definition.frames)) {
    const result: ISpriteSheetJSONArray = {
      frames: definition.frames,
      kind: SpriteSheetKind.JSON_TP_Array,
      meta: definition.meta,
    };
    return result;
  } else {
    const result: ISpriteSheetJSONHash = {
      frames: definition.frames,
      kind: SpriteSheetKind.JSON_TP_Hash,
      meta: definition.meta,
    };
    return result;
  }
}

export interface ITextureMap {
  [texture: string]: ImageBitmap;
}

export async function createTextureMap(definitionPromise: Promise<ISpriteSheet>, imgPromise: Promise<ImageBitmap>) {
  const textures: ITextureMap = {};
  const definition = await definitionPromise;
  const img = await imgPromise;
  switch (definition.kind) {
    case SpriteSheetKind.JSON:
      const jsonKind: ISpriteSheetJSON = definition as ISpriteSheetJSON;
      for (const frame of jsonKind) {
        textures[frame.name] = await createImageBitmap(
          img,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
        );
      }
      break;
    case SpriteSheetKind.JSON_TP_Array:
      const spritesheetArrayKind: ISpriteSheetJSONArray = definition as ISpriteSheetJSONArray;
      for (const arrayFrame of spritesheetArrayKind.frames) {
        textures[arrayFrame.filename] = await createImageBitmap(
          img,
          arrayFrame.x,
          arrayFrame.y,
          arrayFrame.w,
          arrayFrame.h,
        );
      }
      break;
    case SpriteSheetKind.JSON_TP_Hash:
      const spritesheetHashKind: ISpriteSheetJSONHash = definition as ISpriteSheetJSONHash;
      for (const frame of Object.keys(spritesheetHashKind.frames)) {
        const spriteFrame = spritesheetHashKind.frames[frame];
        textures[frame] = await createImageBitmap(
          img,
          spriteFrame.x,
          spriteFrame.y,
          spriteFrame.w,
          spriteFrame.h,
        );
      }
      break;
  }
  return textures;
}

export async function loadImage(url: string | Request, opts?: RequestInit): Promise<ImageBitmap> {
  const res = await fetch(url, opts);
  const blob = await res.blob();
  return createImageBitmap(blob);
}
