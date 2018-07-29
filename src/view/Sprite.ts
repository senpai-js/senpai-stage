import assert from "assert";
import { EventEmitter } from "events";
import * as eases from "../ease";
import * as m from "../matrix";
import { createTextureMap, IInteractionPoint, IKeyState, ILoadProps, ISize, ITextureMap, loadImage } from "../util";
import { IStage } from "./Stage";

export interface ISprite extends ISize {
  id: string;
  parent: IStage | ISprite;

  // position

  previousPosition: Float64Array;
  position: Float64Array;
  inverse: Float64Array;
  alpha: number;
  interpolatedAlpha: number;
  previousAlpha: number;
  z: number;

  // animation

  lastInterpolated: number;
  interpolatedPosition: Float64Array;
  animationStart: number;
  animationLength: number;
  wait: number;
  // stage properties

  active: boolean;
  hover: boolean;
  down: boolean;
  cursor: "pointer" | "default";

  texture: ImageBitmap | HTMLCanvasElement | HTMLImageElement;

  // this is set by the over function
  ease(ratio: number): number;

  broadPhase(point: IInteractionPoint): boolean;
  narrowPhase(point: IInteractionPoint): ISprite;
  isHovering(point: IInteractionPoint, now: number): ISprite;
  pointCollision(point: IInteractionPoint): boolean;
  keyStateChange(key: IKeyState): void;
  setTexture(texture: string): this;
  over(timespan: number, wait: number, ease: (ratio: number) => number): this;
  move(position: number[] | Float64Array): this;
  setZ(z: number): this;
  setAlpha(alpha: number): this;
  interpolate(now: number): void;
  skipAnimation(now: number): boolean;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
  emit(event: string, ...args: any[]): boolean;

  on(event: "point-move", callback: (sprite: ISprite, point: IInteractionPoint) => void);
  on(event: string, callback: () => void): this;

  on(event: "point-move", callback: (sprite: ISprite, point: IInteractionPoint) => void);
  once(event: string, callback: () => void): this;

  removeAllListeners(event: string | symbol): this;
  eventNames(): Array<string | symbol>;
}

export interface ISpriteProps {
  id: string;
  position: Float64Array | number[];
  textures?: ITextureMap;
  alpha?: number;
  z?: number;
}

export class Sprite extends EventEmitter implements ISprite {
  public id: string = "";
  public position: Float64Array = new Float64Array(6);
  public previousPosition: Float64Array = new Float64Array(6);
  public interpolatedPosition: Float64Array = new Float64Array(6);
  public inverse: Float64Array = new Float64Array(6);
  public alpha: number = 1;
  public interpolatedAlpha: number = 1;
  public previousAlpha: number = 1;
  public z: number = 0;
  public parent: ISprite = null;
  public wait: number = 0;

  public lastInterpolated: number = 0;
  public animationStart: number = 0;
  public ease = eases.easeLinear;
  public cursor: ("pointer" | "default") = "default";
  public animationLength: number = 0;
  public active: boolean = false;
  public hover: boolean = false;
  public down: boolean = false;
  public textures: ITextureMap = {};
  public texture: ImageBitmap | HTMLCanvasElement | HTMLImageElement = new Image();

  public width: number = 0;
  public height: number = 0;

  constructor(props: ISpriteProps) {
    super();
    this.id = props.id;
    const position = props.position || m.Identity;
    this.textures = props.textures ? props.textures : this.textures;
    m.set(this.position, position);
    m.set(this.previousPosition, position);
    m.set(this.interpolatedPosition, position);

    if (props.hasOwnProperty("alpha")) {
      this.previousAlpha = this.alpha = this.interpolatedAlpha = props.alpha;
    }
    if (props.hasOwnProperty("z")) {
      this.z = props.z;
    }
  }

  public broadPhase(point: IInteractionPoint): boolean {
    return point.tx >= 0 && point.tx <= this.width && point.ty >= 0 && point.ty <= this.height;
  }

  public narrowPhase(point: IInteractionPoint): ISprite {
    return this;
  }

  public pointCollision(point: IInteractionPoint): boolean {
    return true;
  }

  public isHovering(point: IInteractionPoint, now: number): ISprite {
    this.interpolate(now);
    m.transformPoint(point, this.inverse);
    if (this.broadPhase(point)) {
      return this.narrowPhase(point);
    }
  }

  public move(position: number[] | Float64Array): this {
    this.previousPosition[0] = this.interpolatedPosition[0];
    this.previousPosition[1] = this.interpolatedPosition[1];
    this.previousPosition[2] = this.interpolatedPosition[2];
    this.previousPosition[3] = this.interpolatedPosition[3];
    this.previousPosition[4] = this.interpolatedPosition[4];
    this.previousPosition[5] = this.interpolatedPosition[5];

    this.position[0] = position[0];
    this.position[1] = position[1];
    this.position[2] = position[2];
    this.position[3] = position[3];
    this.position[4] = position[4];
    this.position[5] = position[5];
    return this;
  }

  public setAlpha(alpha: number): this {
    this.previousAlpha = this.interpolatedAlpha;
    this.alpha = alpha;
    return this;
  }

  public setZ(z: number): this {
    this.z = z;
    return this;
  }

  public over(timespan: number, wait: number = 0, ease: (ratio: number) => number = this.ease): this {
    this.animationLength = timespan;
    this.animationStart = Date.now();
    this.ease = ease || this.ease;
    this.wait = wait;
    return this;
  }

  public keyStateChange(key: IKeyState): void {
    throw new Error("Not implemented.");
  }

  public skipAnimation(now: number): boolean {
    const result: boolean = now < this.animationLength + this.animationStart;
    this.animationStart = now - this.animationLength;
    return result;
  }

  public update(): void {
    // No op
  }
  public interpolate(now: number): void {
    if (now <= this.lastInterpolated) {
      return;
    }
    this.lastInterpolated = now;

    const progress = now - (this.animationStart + this.wait);

    const ratio = (progress >= this.animationLength)
        ? 1
        : (progress <= 0 ? 0 : this.ease(progress / this.animationLength));

    if (ratio === 1) {
      this.interpolatedPosition[0] = this.position[0];
      this.interpolatedPosition[1] = this.position[1];
      this.interpolatedPosition[2] = this.position[2];
      this.interpolatedPosition[3] = this.position[3];
      this.interpolatedPosition[4] = this.position[4];
      this.interpolatedPosition[5] = this.position[5];
      this.interpolatedAlpha = this.alpha;
    } else if (ratio === 0) {
      this.interpolatedPosition[0] = this.previousPosition[0];
      this.interpolatedPosition[1] = this.previousPosition[1];
      this.interpolatedPosition[2] = this.previousPosition[2];
      this.interpolatedPosition[3] = this.previousPosition[3];
      this.interpolatedPosition[4] = this.previousPosition[4];
      this.interpolatedPosition[5] = this.previousPosition[5];
      this.interpolatedAlpha = this.previousAlpha;
    } else {
      for (let j = 0; j < 6; j++) {
        this.interpolatedPosition[j] = this.previousPosition[j]
          + ratio * (this.position[j] - this.previousPosition[j]);
      }
      this.interpolatedAlpha = this.previousAlpha + ratio * (this.alpha - this.previousAlpha);
    }

    m.inverse(this.interpolatedPosition, this.inverse);

    if (this.parent) {
      this.parent.interpolate(now);

      m.chain(this.parent.inverse, true)
        .transform(this.inverse)
        .set(this.inverse);
    }
  }
  public setTexture(texture: string): this {
    assert(this.textures[texture]);

    const oldTexture = this.texture;
    this.texture = this.textures[texture];
    this.width = this.texture.width;
    this.height = this.texture.height;

    if (oldTexture !== this.texture) {
      this.emit("texture-change", this.texture);
    }

    return this;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.texture, 0, 0);
  }
}

export interface ILoadSpriteProps extends ISpriteProps, ILoadProps {

}

export async function loadSprite(props: ILoadSpriteProps): Promise<ISprite> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);
  props.textures = textures;
  return new Sprite(props);
}
