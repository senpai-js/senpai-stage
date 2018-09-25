import { ISpriteSheet } from "../spritesheet";
import { ISenpaiEvent } from "./SenpaiEvent";

export interface ISpriteLoadedEvent extends ISenpaiEvent {
  eventType: "SpriteLoaded";
  spriteSource: ImageBitmap;
  definition: ISpriteSheet;
}
