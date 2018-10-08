import * as eases from "../ease";
import {
  EventEmitter,
  IKeyDownEvent,
  IKeyUpEvent,
  IPointClickEvent,
  IPointDownEvent,
  IPointEvent,
  IPointMoveEvent,
  IPointUpEvent,
  IValueChangeEvent,
} from "../events";
import { ISpriteLoadedEvent } from "../events/SpriteEvents";
import { CanvasMatrix2D, copy, Identity, transformPoint, use } from "../matrix";
import { createTextureMap, ISpriteSheet, ITextureMap, loadImage, loadSpriteSheet } from "../spritesheet";
import { Cursor, IInteractionPoint, IKeyFrameEntry, IMoveKeyFrame, ISize, ISpritePosition, IWaitKeyFrame, KeyFrameEntryType, SpriteType } from "../util";
import { IContainer } from "./Container";

// import { IStage } from "./Stage";

export interface ISprite extends ISize {
  id: string;
  parent: ISprite;
  container: IContainer;
  readonly type: SpriteType;

  // position
  previousPosition: CanvasMatrix2D;

  inverse: CanvasMatrix2D;
  interpolatedAlpha: number;
  previousAlpha: number;
  z: number;

  // animation
  textures: ITextureMap;
  lastInterpolated: number;
  interpolatedPosition: CanvasMatrix2D;

  // stage properties
  active: boolean;
  hover: boolean;
  down: boolean;
  focused: boolean;
  tabIndex: number;
  cursor: Cursor;
  loaded: Promise<void>;
  texture: string;

  // events
  pointUpEvent: EventEmitter<IPointUpEvent>;
  pointDownEvent: EventEmitter<IPointEvent>;
  pointClickEvent: EventEmitter<IPointClickEvent>;
  pointMoveEvent: EventEmitter<IPointMoveEvent>;
  keyDownEvent: EventEmitter<IKeyDownEvent>;
  keyUpEvent: EventEmitter<IKeyUpEvent>;
  loadedEvent: EventEmitter<ISpriteLoadedEvent>;

  textureChangeEvent: EventEmitter<IValueChangeEvent<string>>;

  // animation properties
  keyFrames: IKeyFrameEntry[];
  keyFrameIndex: number;

  broadPhase(point: IInteractionPoint): boolean;
  narrowPhase(point: IInteractionPoint): ISprite;
  isHovering(point: IInteractionPoint, now: number): ISprite;
  isFocused(): ISprite;
  pointCollision(point: IInteractionPoint): boolean;
  setTexture(texture: string): this;
  setZ(z: number): this;
  visible(alpha: number): this;
  interpolate(now: number): void;
  skipAnimation(now: number): boolean;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
  keyDown(event: IKeyDownEvent): void;
  keyUp(event: IKeyUpEvent): void;

  // animation functions and properties
  wait(length: number): this;
  move(to: CanvasMatrix2D): this;
  over(animationLength: number): this;
  with(ease: eases.EaseFunc): this;
  movePosition(to: ISpritePosition): this;
  repeat(): this;
  clearAnimation(now: number): this;
}

export interface ISpriteProps {
  id: string;
  position: CanvasMatrix2D;
  textures?: ITextureMap;
  alpha?: number;
  z?: number;
  source: Promise<ImageBitmap>;
  definition: Promise<ISpriteSheet>;
}

export class Sprite implements ISprite {
  public id: string = "";
  public type: SpriteType = SpriteType.Sprite;
  public position: CanvasMatrix2D = Identity.slice() as CanvasMatrix2D;
  public previousPosition: CanvasMatrix2D = Identity.slice() as CanvasMatrix2D;
  public interpolatedPosition: CanvasMatrix2D = Identity.slice() as CanvasMatrix2D;
  public inverse: CanvasMatrix2D = Identity.slice() as CanvasMatrix2D;
  public interpolatedAlpha: number = 1;
  public previousAlpha: number = 1;
  public z: number = 0;
  public parent: ISprite = null;
  public container: IContainer = null;
  public lastInterpolated: number = 0;
  public cursor: Cursor = Cursor.auto;
  public active: boolean = false;
  public hover: boolean = false;
  public down: boolean = false;
  public textures: ITextureMap = {};
  public texture: string;
  public loaded: Promise<void> = null;
  public focused: boolean = false;
  public tabIndex: number = 0;
  public width: number = 0;
  public height: number = 0;
  public pointDownEvent: EventEmitter<IPointDownEvent> = new EventEmitter<IPointDownEvent>();
  public pointUpEvent: EventEmitter<IPointUpEvent> = new EventEmitter<IPointUpEvent>();
  public pointMoveEvent: EventEmitter<IPointMoveEvent> = new EventEmitter<IPointMoveEvent>();
  public pointClickEvent: EventEmitter<IPointClickEvent> = new EventEmitter<IPointClickEvent>();
  public keyDownEvent: EventEmitter<IKeyDownEvent> = new EventEmitter<IKeyDownEvent>();
  public keyUpEvent: EventEmitter<IKeyUpEvent> = new EventEmitter<IKeyUpEvent>();
  public loadedEvent: EventEmitter<ISpriteLoadedEvent> = new EventEmitter<ISpriteLoadedEvent>();
  public textureChangeEvent: EventEmitter<IValueChangeEvent<string>> = new EventEmitter<IValueChangeEvent<string>>();
  public keyFrames: IKeyFrameEntry[] = [];
  public keyFrameIndex: number = 0;

  constructor(props: ISpriteProps) {
    this.id = props.id;
    const position: CanvasMatrix2D = props.position || Identity.slice() as CanvasMatrix2D;
    this.textures = props.textures ? props.textures : this.textures;
    use(position)
      .setTo(this.position)
      .setTo(this.previousPosition)
      .setTo(this.interpolatedPosition);

    if (props.hasOwnProperty("alpha")) {
      this.previousAlpha = this.interpolatedAlpha = props.alpha;
    }
    if (props.hasOwnProperty("z")) {
      this.z = props.z;
    }
    if (props.source && props.definition) {
      this.loadTexture(
        props.definition,
        props.source,
      );
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

    transformPoint(point, this.inverse);
    if (this.broadPhase(point)) {
      return this.narrowPhase(point);
    }
  }

  public isFocused(): ISprite {
    return this.focused ? this : null;
  }

  public wait(length: number): this {
    const start = this.keyFrames.length > 0
      ? this.keyFrames[this.keyFrames.length - 1].end
      : Date.now();

    this.keyFrames.push({
      ease: null,
      end: start + length,
      start,
      to: null,
      type: KeyFrameEntryType.Wait,
    } as IWaitKeyFrame);
    return this;
  }
  public movePosition(position: ISpritePosition): this {

    use(this.previousPosition).set(this.interpolatedPosition);
    const sx = position.sx || position.sx === 0 ? position.sx : position.s;
    const sy = position.sy || position.sy === 0 ? position.sy : position.s;
    use(this.position)
      .set(Identity)
      .translate(position.x || 0, position.y || 0)
      .rotate(position.r || 0)
      .scale(sx === 0 ? 0 : sx || 1, sy === 0 ? 0 : sy || 1)
      .translate(position.cx ? -position.cx : 0, position.cy ? -position.cy : 0);
    return this;
  }

  public move(position: CanvasMatrix2D): this {
    for (let i = 0; i < 6; i++) {
      if (!Number.isFinite(position[i])) {
        throw new Error(`Invalid Canvas Matrix for sprite ${this.id}, property ${i} is not a finite value.`);
      }
    }
    const start = this.keyFrames.length > 0
      ? this.keyFrames[this.keyFrames.length - 1].end
      : Date.now();

    this.keyFrames.push({
      ease: eases.easeLinear,
      end: start,
      start,
      to: position.slice(),
      type: KeyFrameEntryType.Move,
    } as IMoveKeyFrame);
    return this;
  }

  public visible(alpha: number = 1): this {
    if (!Number.isFinite(alpha)) {
      throw new Error(
        `Cannot set alpha value on sprite ${this.id}: ${alpha} is not finite. This results in undefined behavior.`,
      );
    }
    if (alpha < 0 || alpha > 1) {
      throw new Error(
        `Cannot set alpha value on sprite ${this.id}: ${alpha} is not within range [0, 1].`,
      );
    }
    // TODO: set alpha of latest keyframe. If no keyframe exists, add a new `move`

    return this;
  }

  public setZ(z: number): this {
    if (!Number.isFinite(z)) {
      throw new Error(
        `Cannot set Z value on sprite ${this.id}: ${z} is not finite. This results in undefined behavior.`,
      );
    }
    this.z = z;
    return this;
  }

  public over(timespan: number): this {
    if (!Number.isFinite(timespan)) {
      throw new Error(`Timespan is not finite: received value ${timespan}`);
    }
    // TODO: throw if no keyframe has been added yet
    // TODO: set current keyframe's timespan
    return this;
  }

  public use(ease: eases.EaseFunc): this {
    if (typeof ease !== "function") {
      throw new Error(`Ease is not a function: received value ${ease}`);
    }
    // TODO: throw if no keyframe has been added yet
    // TODO: set current keyframe ease
    return this;
  }

  public run(): this {
    this.keyFrameIndex = 0;
    return this;
  }

  public skipAnimation(now: number): boolean {
    // TODO: determine if animation was skipped
    // TODO: check if animation repeats, if it does, return false
    // TODO: set keyframe index to last
    // TODO: set lastInterpolated to last keyframe `end`
    // TODO: set interpolatedAlpha to last keyframe `alpha`
    // TODO: set interpolatedPosition to last keyframe `to` (check `to` property values for nulls)
    return false;
  }

  public update(): void {
    // No op
  }
  public interpolate(now: number): void {
    if (now <= this.lastInterpolated) {
      return;
    }
    this.lastInterpolated = now;
    /*

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
    */
    // TODO: Calculate interpolated position from keyframes
    copy(this.interpolatedPosition)
      .inverse()
      .setTo(this.inverse);

    if (this.parent) {
      // assert the parent is properly moved
      this.parent.interpolate(now);

      copy(this.parent.inverse)
        .transform(this.inverse)
        .setTo(this.inverse);
    }
  }
  public setTexture(texture: string): this {
    const oldTexture = this.texture;
    this.texture = texture;
    this.width = this.textures[this.texture].width;
    this.height = this.textures[this.texture].height;

    if (oldTexture !== this.texture) {
      // this.emit("texture-change", this.texture); // TODO
    }

    return this;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.textures[this.texture], 0, 0);
  }

  public keyDown(event: IKeyDownEvent): void {
    this.keyDownEvent.emit(event);
  }

  public keyUp(event: IKeyUpEvent): void {
    this.keyUpEvent.emit(event);
  }

  public with(ease: eases.EaseFunc): this {
    return this;
  }

  public repeat(): this {
    return this;
  }

  public clearAnimation(now: number): this {
    return this;
  }
  private async loadTexture(defintion: Promise<ISpriteSheet>, source: Promise<ImageBitmap>): Promise<void> {
    this.textures = await createTextureMap(defintion, source);
    this.loadedEvent.emit({
      definition: await defintion,
      eventType: "SpriteLoaded",
      source: this,
      spriteSource: await source,
      stage: this.container,
    });
  }
}
