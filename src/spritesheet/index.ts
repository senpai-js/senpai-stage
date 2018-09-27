export interface ISpriteSheet {
  kind: SpriteSheetKind;
}

export enum SpriteSheetKind {
  JSON,
  JSON_TP_Hash,
  JSON_TP_Array,
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

export type ISpriteSheetJSON = Array<{
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}> & {
  kind: SpriteSheetKind.JSON;
};

export async function loadSpriteSheet(url: string | Request, opts?: RequestInit): Promise<ISpriteSheet> {
  const resp = await fetch(url, opts);
  const definition = await resp.json();
  return createSpriteSheet(definition);
}

export function createSpriteSheet(definition: any): ISpriteSheet {
  if (Array.isArray(definition)) {
    const result: ISpriteSheetJSON = definition as ISpriteSheetJSON;
    result.kind = SpriteSheetKind.JSON;
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
          arrayFrame.frame.x,
          arrayFrame.frame.y,
          arrayFrame.frame.w,
          arrayFrame.frame.h,
        );
      }
      break;
    case SpriteSheetKind.JSON_TP_Hash:
      const spritesheetHashKind: ISpriteSheetJSONHash = definition as ISpriteSheetJSONHash;
      for (const frame of Object.keys(spritesheetHashKind.frames)) {
        const spriteFrame = spritesheetHashKind.frames[frame];
        textures[frame] = await createImageBitmap(
          img,
          spriteFrame.frame.x,
          spriteFrame.frame.y,
          spriteFrame.frame.w,
          spriteFrame.frame.h,
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
