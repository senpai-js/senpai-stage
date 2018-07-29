import assert from "assert";
import {
  createTextureMap,
  IInteractionPoint,
  ILoadProps,
  ITextureMap,
  loadImage,
  TextAlign,
  TextBaseline,
} from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ICheckbox extends ISprite {
  checked: boolean;
  text: string;
  font: string;
  fontColor: string;
  fontSize: number;
  textAlign: TextAlign;
  textBaseline: TextBaseline;

  setText(text: string): this;
  toggle(): this;
}

export interface ICheckboxProps extends ISpriteProps {
  checked?: boolean;
  text?: string;
  font?: string;
  fontColor?: string;
  fontSize?: number;
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
}

export class Checkbox extends Sprite implements ICheckbox {
  public checked: boolean = false;
  public text: string = "";
  public font: string = "monospace";
  public fontColor: string = "black";
  public fontSize: number = 12;
  public textAlign: TextAlign = TextAlign.left;
  public textBaseline: TextBaseline = TextBaseline.middle;

  constructor(props: ICheckboxProps) {
    super(props);
    this.checked = Boolean(props.checked) || false;
    this.text = props.text || this.text;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.textAlign = props.textAlign || this.textAlign;
    this.textBaseline = props.textBaseline || this.textBaseline;
  }

  public toggle(): this {
    this.checked = !this.checked;
    return this;
  }

  public pointCollision(point: IInteractionPoint): boolean {
    if (point.clicked && point.active === this) {
      this.toggle();
      this.emit("toggle", point);
    }
    return super.pointCollision(point);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    ctx.translate(this.width * 1.1, this.height / 2);
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.fillStyle = this.fontColor;
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillText(this.text, 0, 0);
  }

  public update(): void {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    const checked = this.checked ? "Checked" : "Unchecked";
    this.setTexture(`${active}_${hover}_${checked}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }

  public setText(text: string): this {
    this.text = text;
    return this;
  }
}

export interface ILoadCheckboxProps extends ICheckboxProps, ILoadProps {

}

export async function loadCheckbox(props: ILoadCheckboxProps): Promise<ICheckbox> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  ["Active", "Inactive"].forEach(active => {
    ["Hover", "NoHover"].forEach(hover => {
      ["Checked", "Unchecked"].forEach(checked => {
        assert(textures[`${active}_${hover}_${checked}`]);
      });
    });
  });

  props.textures = textures;
  const checkbox = new Checkbox(props);

  return checkbox;
}
