import { Cursor, SpriteType, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface IButton extends ISprite {
  selected: boolean;
  font: string;
  fontColor: string;
  fontSize: number;
  text: string;
  textAlign: TextAlign;
  textBaseline: TextBaseline;
  setText(text: string): this;
}

export interface IButtonProps extends ISpriteProps {
  selected?: boolean;
  font?: string;
  fontColor?: string;
  fontSize?: number;
  text?: string;
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
}

export class Button extends Sprite implements IButton {
  public readonly type: SpriteType = SpriteType.Button;
  public selected: boolean = false;
  public font: string = "monospace";
  public fontColor: string = "black";
  public fontSize: number = 12;
  public text: string =  "";
  public textAlign: TextAlign = TextAlign.center;
  public textBaseline: TextBaseline = TextBaseline.middle;
  public cursor: Cursor = Cursor.pointer;

  constructor(props: IButtonProps) {
    super(props);
    this.selected = props.selected || false;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.fontSize = props.fontSize || this.fontSize;
    this.text = props.text || this.text;
    this.textAlign = props.textAlign;
    this.textBaseline = props.textBaseline;
  }

  public update(): void {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    const selected = this.selected ? "Selected" : "Unselected";
    this.setTexture(`${active}_${hover}_${selected}`);

    super.update();
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    ctx.translate(this.textures[this.texture].width * 0.5, this.textures[this.texture].height * 0.5);
    ctx.textBaseline = TextBaseline.middle;
    ctx.textAlign = TextAlign.center;
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.text, 0, 0);
  }

  public setText(text: string): this {
    this.text = text;
    return this;
  }
}
