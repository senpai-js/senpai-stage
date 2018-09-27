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
import { CanvasMatrix2D, Identity, transform2D, transformCopy2D, transformPoint } from "../matrix";
import { createTextureMap, ISpriteSheet, ITextureMap, loadImage, loadSpriteSheet } from "../spritesheet";
import { Cursor, IInteractionPoint, ISize, ISpritePosition, SpriteType } from "../util";
import { IContainer } from "./Container";

// import { IStage } from "./Stage";

export interface ISprite extends ISize {
  id: string;
  parent: ISprite;
  container: IContainer;
  readonly type: SpriteType;

  // position
  previousPosition: CanvasMatrix2D;
  position: CanvasMatrix2D;
  inverse: CanvasMatrix2D;
  alpha: number;
  interpolatedAlpha: number;
  previousAlpha: number;
  z: number;

  // animation
  textures: ITextureMap;
  lastInterpolated: number;
  interpolatedPosition: CanvasMatrix2D;
  animationStart: number;
  animationLength: number;
  wait: number;
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

  // this is set by the over function
  ease(ratio: number): number;

  broadPhase(point: IInteractionPoint): boolean;
  narrowPhase(point: IInteractionPoint): ISprite;
  isHovering(point: IInteractionPoint, now: number): ISprite;
  pointCollision(point: IInteractionPoint): boolean;
  setTexture(texture: string): this;
  over(timespan: number, wait: number, ease: (ratio: number) => number): this;
  movePosition(position: ISpritePosition): this;
  move(position: CanvasMatrix2D): this;
  setZ(z: number): this;
  setAlpha(alpha: number): this;
  interpolate(now: number): void;
  skipAnimation(now: number): boolean;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
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
  public alpha: number = 1;
  public interpolatedAlpha: number = 1;
  public previousAlpha: number = 1;
  public z: number = 0;
  public parent: ISprite = null;
  public container: IContainer = null;
  public wait: number = 0;

  public lastInterpolated: number = 0;
  public animationStart: number = 0;
  public ease = eases.easeLinear;
  public cursor: Cursor = Cursor.auto;
  public animationLength: number = 0;
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

  constructor(props: ISpriteProps) {
    this.id = props.id;
    const position: CanvasMatrix2D = props.position || Identity.slice() as CanvasMatrix2D;
    this.textures = props.textures ? props.textures : this.textures;
    transform2D(this.position)
      .set(position);
    transform2D(this.previousPosition)
      .set (position);
    transform2D(this.interpolatedPosition)
      .set(position);

    if (props.hasOwnProperty("alpha")) {
      this.previousAlpha = this.alpha = this.interpolatedAlpha = props.alpha;
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

  public movePosition(position: ISpritePosition): this {
    const sx = position.sx || position.sx === 0 ? position.sx : position.s;
    const sy = position.sy || position.sy === 0 ? position.sy : position.s;

    return this.move(
      transformCopy2D(Identity)
        .translate(position.x || 0, position.y || 0)
        .rotate(position.r || 0)
        .scale(sx === 0 ? 0 : sx || 1, sy === 0 ? 0 : sy || 1)
        .translate(position.cx ? -position.cx : 0, position.cy ? -position.cy : 0)
        .value,
    );
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

    transformCopy2D(this.interpolatedPosition)
      .inverse()
      .setTo(this.inverse);

    if (this.parent) {
      // assert the parent is properly moved
      this.parent.interpolate(now);

      transformCopy2D(this.parent.inverse)
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
