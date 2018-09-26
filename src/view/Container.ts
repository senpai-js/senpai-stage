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

export class Container implements IContainer {

  public sprites: ISprite[] = [];
  public playables: IPlayable[] = [];
  public points: IInteractionPoint[] = [];
  public audioContext: AudioContext = null;

  constructor(props: IContainerProps) {
    this.audioContext = props.audioContext || new AudioContext();
  }

  public addSprite(sprite: ISprite): this {
    if (!this.sprites.includes(sprite)) {
      this.sprites.push(sprite);
      sprite.container = this;
    }
    return this;
  }

  public removeSprite(sprite: ISprite): this {
    if (this.sprites.includes(sprite)) {
      this.sprites.splice(this.sprites.indexOf(sprite), 1);
      sprite.container = null;
    }
    return this;
  }

  public addPlayable(sprite: IPlayable): this {
    if (!this.playables.includes(sprite)) {
      this.playables.push(sprite);
      // NOTE: This may be audio specific?
      //      sprite.gain.connect(this.audioContext.destination);
    }
    return this;
  }

  public removePlayable(sprite: IPlayable): this {
    if (this.playables.includes(sprite)) {
      this.playables.splice(this.playables.indexOf(sprite), 1);
      // NOTE: This may be audio specific?
      //      sprite.gain.disconnect(this.audioContext.destination);
    }
    return this;
  }

  public addPoint(point: IInteractionPoint): this {
    if (!this.points.includes(point)) {
      this.points.push(point);
    }
    return this;
  }

  public removePoint(point: IInteractionPoint): this {
    if (this.points.includes(point)) {
      this.points.splice(this.points.indexOf(point), 1);
    }
    return this;
  }

  public getSpriteByID(id: string): ISprite {
    for (const sprite of this.sprites) {
      if (sprite.id === id) {
        return sprite;
      }
    }
    return null;
  }

  public getPointByID(id: string): IInteractionPoint {
    for (const sprite of this.points) {
      if (sprite.id === id) {
        return sprite;
      }
    }
    return null;
  }

  public getPlayableByID(id: string): IPlayable {
    for (const sprite of this.playables) {
      if (sprite.id === id) {
        return sprite;
      }
    }
    return null;
  }
}
