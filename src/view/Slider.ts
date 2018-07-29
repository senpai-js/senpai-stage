import assert from "assert";
import { createTextureMap, IInteractionPoint, ILoadProps, ITextureMap, loadImage } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ISlider extends ISprite {
  value: number;
  max: number;
  min: number;
  width: number;
}

export interface ISliderProps extends ISpriteProps {
  value?: number;
  max?: number;
  min?: number;
  width: number;
}

export class Slider extends Sprite implements ISlider {
  public value: number = 0;
  public max: number = 1;
  public min: number = 0;
  public width: number = 100;

  private sliderPattern: CanvasPattern = null;
  private pillTexture: ImageBitmap = null;

  constructor(props: ISliderProps) {
    super(props);

    this.height = props.textures.Pill_Hover.height;
    this.width = props.width;
    this.max = props.max || this.max;
    this.min = props.min || this.min;
    this.value = props.value || this.value;

    this.sliderPattern = document
      .createElement("canvas")
      .getContext("2d")
      // @ts-ignore: Dom Spec Outdated. ImageBitmap is acceptable parameter for createPattern.
      .createPattern(props.textures.Line, "repeat-x");
  }

  public broadPhase(point: IInteractionPoint): boolean {
    if (this.active) {
      return true;
    }
    return super.broadPhase(point);
  }

  public narrowPhase(point: IInteractionPoint): ISprite {
    if (this.active) {
      return this;
    }
    const sliderDistance = this.width - this.textures.Pill_Hover.width;
    const sliderValuePercent = (this.value - this.min) / (this.max - this.min);
    const valueX = sliderDistance * sliderValuePercent;

    if (point.ty <= this.textures.Pill_Hover.height
        && point.ty >= 0
        && point.tx >= valueX
        && point.tx <= valueX + this.textures.Pill_Hover.width) {
        return this;
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
        super.emit("value-change", this);
      }
    }

    return true;
  }

  public update(): void {
    this.cursor = this.hover ? "pointer" : "default";
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

export interface ILoadSliderProps extends ISliderProps, ILoadProps {

}

export async function loadSlider(props: ILoadSliderProps): Promise<ISlider> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  assert(textures.Line_Cap_Left);
  assert(textures.Line_Cap_Right);
  assert(textures.Line);
  assert(textures.Pill);
  assert(textures.Pill_Active);
  assert(textures.Pill_Hover);

  props.textures = textures;

  const slider = new Slider(props);
  return slider;
}
