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
import {
  Cursor,
  IInteractionPoint,
  IKeyFrameEntry,
  ISize,
  ISpritePosition,
  KeyFrameEntryType,
  SpriteType,
} from "../util";
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

  constructor(props: ISpriteProps) {
    this.id = props.id;
    const position: CanvasMatrix2D = props.position || Identity.slice() as CanvasMatrix2D;
    this.textures = props.textures ? props.textures : this.textures;
    use(position)
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
    if (!Number.isFinite(length)) {
      throw new Error(`Cannot create wait keyframe: wait time is not finite (received: ${length})`);
    }
    if (length < 0) {
      throw new Error(`Cannot create wait keyframe: wait time is not positive (received: ${length})`);
    }
    const lastKeyFrame = this.getLastKeyFrame();
    if (lastKeyFrame && lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      throw new Error(`Cannot move sprite after an animation repeats. (Did you call repeat before sprite.wait?)`);
    }
    const kf = this.createKeyFrame();
    kf.type = KeyFrameEntryType.Wait;
    kf.end = kf.start + length;
    this.keyFrames.push(kf);
    return this;
  }
  public movePosition(position: ISpritePosition): this {
    const lastKeyFrame = this.getLastKeyFrame();
    if (lastKeyFrame && lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      throw new Error(
        `Cannot move sprite after an animation repeats. (Did you call repeat before sprite.movePosition?)`,
      );
    }

    const sx = position.sx || position.sx === 0 ? position.sx : position.s;
    const sy = position.sy || position.sy === 0 ? position.sy : position.s;
    const kf = this.createKeyFrame();

    const { value } = copy(Identity)
      .translate(position.x || 0, position.y || 0)
      .rotate(position.r || 0)
      .scale(sx === 0 ? 0 : sx || 1, sy === 0 ? 0 : sy || 1)
      .translate(position.cx ? -position.cx : 0, position.cy ? -position.cy : 0);
    kf.to = value;

    this.keyFrames.push(kf);
    return this;
  }

  public move(position: CanvasMatrix2D): this {
    for (let i = 0; i < 6; i++) {
      if (!Number.isFinite(position[i])) {
        throw new Error(`Invalid Canvas Matrix for sprite ${this.id}, property ${i} is not a finite value.`);
      }
    }

    const lastKeyFrame = this.getLastKeyFrame();
    if (lastKeyFrame && lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      throw new Error(`Cannot move sprite after an animation repeats. (Did you call repeat before sprite.move?)`);
    }

    const kf = this.createKeyFrame();
    kf.to = copy(position).value;
    this.keyFrames.push(kf);

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
    const lastKeyFrame = this.getLastKeyFrame();
    if (lastKeyFrame && lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      throw new Error(
        `Cannot make sprite visible after an animation repeats. (Did you call repeat before sprite.visible?)`,
      );
    }

    const kf = lastKeyFrame || this.createKeyFrame();
    kf.alpha = alpha;

    if (this.keyFrames.length === 0) {
      this.keyFrames.push(kf);
    }
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
      throw new Error(`Cannot set timespan: Timespan is not finite (received value ${timespan})`);
    }
    if (timespan < 0) {
      throw new Error(`Cannot set timespan: Timespan is not positive (received value ${timespan})`);
    }
    const lastKeyFrame = this.getLastKeyFrame();
    if (!lastKeyFrame) {
      throw new Error(`Cannot set timespan: no keyframe exists.`);
    }

    if (lastKeyFrame && lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      throw new Error(
        `Cannot change sprite animation length after an animation repeats. (Did you call repeat before sprite.over?)`,
      );
    }
    lastKeyFrame.end = lastKeyFrame.start + timespan;
    return this;
  }

  public skipAnimation(now: number): boolean {
    const lastKeyFrame = this.getLastKeyFrame();

    if (!lastKeyFrame) {
      return false;
    }

    if (lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      return false;
    }

    this.clearAnimation(now);
    return lastKeyFrame.end > now;
  }

  public update(): void {
    // No op
  }
  public interpolate(now: number): void {
    if (now <= this.lastInterpolated) {
      return;
    }
    this.lastInterpolated = now;
    const firstKeyFrame = this.keyFrames[0];
    now = Math.max(
      firstKeyFrame ? firstKeyFrame.start : 0,
      now,
    );
    for (const kf of this.keyFrames) {
      if (kf.start <= now) {
        const progress = (now - kf.start) / (kf.end - kf.start);
        const ratio = kf.ease(progress);
        use(this.interpolatedPosition)
          .set(
            progress > 1
              ? kf.to
              : [
                kf.from[0] + ratio * (kf.to[0] - kf.from[0]),
                kf.from[1] + ratio * (kf.to[1] - kf.from[1]),
                kf.from[2] + ratio * (kf.to[2] - kf.from[2]),
                kf.from[3] + ratio * (kf.to[3] - kf.from[3]),
                kf.from[4] + ratio * (kf.to[4] - kf.from[4]),
                kf.from[5] + ratio * (kf.to[5] - kf.from[5]),
              ],
          );
        this.interpolatedAlpha = kf.previousAlpha + ratio * (kf.alpha - kf.previousAlpha);
      }
    }

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
      this.textureChangeEvent.emit({
        eventType: "ValueChange",
        previousValue: oldTexture,
        property: "texture",
        source: this,
        stage: this.container,
        value: this.texture,
      });
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
    const lastKeyFrame = this.getLastKeyFrame();
    if (!lastKeyFrame) {
      throw new Error("Cannot use provided ease because no keyFrames have been created.");
    }
    if (typeof ease !== "function") {
      throw new Error(`Cannot set ease: Ease is not a function. (Received: ${ease})`);
    }
    if (lastKeyFrame.type === KeyFrameEntryType.Repeat) {
      throw new Error("Cannot set ease function of KeyFrame type 'repeat.'");
    }
    lastKeyFrame.ease = ease;
    return this;
  }

  public repeat(): this {
    const kf = this.createKeyFrame();
    kf.type = KeyFrameEntryType.Repeat;
    this.keyFrames.push(kf);
    return this;
  }

  public clearAnimation(now: number): this {
    const lastKeyFrame = this.getLastKeyFrame();
    const alpha = lastKeyFrame
      ? lastKeyFrame.alpha
      : this.interpolatedAlpha;
    this.interpolatedAlpha = alpha;
    this.previousAlpha = alpha;

    this.interpolatedPosition = copy(
      lastKeyFrame
        ? lastKeyFrame.to
        : this.interpolatedPosition,
    ).value;
    this.previousPosition = copy(this.interpolatedPosition).value;

    this.lastInterpolated = now;
    this.keyFrames = [];
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

  private createKeyFrame(): IKeyFrameEntry {
    const lastKeyFrame = this.getLastKeyFrame();

    const previousPosition = lastKeyFrame
      ? lastKeyFrame.to
      : this.interpolatedPosition;
    const alpha = lastKeyFrame
      ? lastKeyFrame.alpha
      : this.interpolatedAlpha;

    const start = lastKeyFrame
      ? lastKeyFrame.end
      : Date.now();

    return {
      alpha,
      ease: lastKeyFrame ? lastKeyFrame.ease : eases.easeLinear,
      end: start,
      from: copy(previousPosition).value,
      previousAlpha: alpha,
      start,
      to: copy(previousPosition).value,
      type: KeyFrameEntryType.Move,
    };
  }

  private getLastKeyFrame(): IKeyFrameEntry {
    return this.keyFrames.length > 0 ? this.keyFrames[this.keyFrames.length - 1] : null;
  }
}
