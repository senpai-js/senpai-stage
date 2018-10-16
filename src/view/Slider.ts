import { EventEmitter, IValueChangeEvent } from "../events";
import { transformPoint } from "../matrix";
import { Cursor, IInteractionPoint, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ISlider extends ISprite {
  value: number;
  max: number;
  min: number;
  width: number;

  valueChangeEvent: EventEmitter<IValueChangeEvent<number>>;
}

const tempctx = document.createElement("canvas").getContext("2d");

export interface ISliderProps extends ISpriteProps {
  value?: number;
  max?: number;
  min?: number;
  width: number;
}

export class Slider extends Sprite implements ISlider {
  public readonly type: SpriteType = SpriteType.Slider;
  public value: number = 0;
  public max: number = 1;
  public min: number = 0;
  public width: number = 100;
  public height: number = 0;

  public valueChangeEvent: EventEmitter<IValueChangeEvent<number>> = new EventEmitter<IValueChangeEvent<number>>();
  public cursor: Cursor = Cursor.pointer;

  private sliderPattern: CanvasPattern = null;
  private pillTexture: ImageBitmap = null;

  constructor(props: ISliderProps) {
    super(props);

    this.width = props.width;
    this.max = props.max || this.max;
    this.min = props.min || this.min;
    this.value = props.value || this.value;
  }

  public broadPhase(point: IInteractionPoint): boolean {
    if (this.active) {
      return true;
    }
    return super.broadPhase(point);
  }

  public narrowPhase(point: IInteractionPoint): ISprite {
    if (this.active || point.firstDown) {
      return this;
    }

    if (this.pointInPill(point)) {
      return this;
    }
  }

  public pointInPill(point: IInteractionPoint): boolean {
    /*
     * NOTE: this checks if the cursor is strictly hovering over the pill
     */
    const sliderDistance = this.width - this.textures.Pill_Hover.width;
    const sliderValuePercent = (this.value - this.min) / (this.max - this.min);
    const valueX = sliderDistance * sliderValuePercent;
    return point.ty <= this.textures.Pill_Hover.height
      && point.ty >= 0
      && point.tx >= valueX
      && point.tx <= valueX + this.textures.Pill_Hover.width;
  }
  public isHovering(point: IInteractionPoint, now: number): ISprite {
    this.interpolate(now);
    transformPoint(point, this.inverse);
    if (this.broadPhase(point)) {
      return this.narrowPhase(point);
    }
  }

  public pointCollision(point: IInteractionPoint): boolean {
    super.pointCollision(point);

    if (this.active && point.active === this) {
      const previousValue = this.value;
      const sliderDistance = this.width - this.textures.Pill_Hover.width;
      const trueTX = point.tx - this.textures.Pill_Hover.width * 0.5;
      const clampedTX = Math.max(0, Math.min(trueTX, sliderDistance));
      const range = this.max - this.min;

      this.value = this.min + range * clampedTX / sliderDistance;
      if (this.value !== previousValue) {
        this.valueChangeEvent.emit({
          eventType: "ValueChange",
          previousValue,
          property: "value",
          source: this,
          stage: this.container,
          value: this.value,
        });
      }
    }

    return true;
  }

  public update(): void {
    if (this.textures.Pill_Hover) {
      this.height = this.textures.Pill_Hover.height;
    }
    if (!this.sliderPattern && this.textures.Line) {
      // createPattern does not accept ImageBitmap in typescript just yet
      this.sliderPattern = tempctx.createPattern(this.textures.Line as any, "repeat-x");
    }
    this.pillTexture = this.active
      ? this.textures.Pill_Active
      : (this.hover ? this.textures.Pill_Hover : this.textures.Pill);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.textures.Line_Cap_Left, 0, 0);
    ctx.drawImage(
      this.textures.Line_Cap_Right,
      this.width - this.textures.Line_Cap_Right.width,
      0,
    );
    ctx.fillStyle = this.sliderPattern;
    ctx.fillRect(
      this.textures.Line_Cap_Left.width,
      0,
      this.width - this.textures.Line_Cap_Left.width - this.textures.Line_Cap_Right.width,
      this.textures.Line.height,
    );
    const sliderDistance = this.width - this.textures.Pill_Hover.width;
    const sliderValuePercent = (this.value - this.min) / (this.max - this.min);
    const valueX = sliderDistance * sliderValuePercent;

    ctx.drawImage(this.pillTexture, valueX, 0);
  }
}
