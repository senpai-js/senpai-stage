import { EventEmitter, IValueChangeEvent } from "../events";
import {
  Cursor,
  IInteractionPoint,
  SpriteType,
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

  checkedChangeEvent: EventEmitter<IValueChangeEvent<boolean>>;

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
  public readonly type: SpriteType = SpriteType.Checkbox;
  public checked: boolean = false;
  public text: string = "";
  public font: string = "monospace";
  public fontColor: string = "black";
  public fontSize: number = 12;
  public textAlign: TextAlign = TextAlign.left;
  public textBaseline: TextBaseline = TextBaseline.middle;
  public checkedChangeEvent: EventEmitter<IValueChangeEvent<boolean>> = new EventEmitter<IValueChangeEvent<boolean>>();

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
    const previousValue = this.checked;
    this.checked = !this.checked;
    this.checkedChangeEvent.emit({
      eventType: "ValueChange",
      previousValue,
      property: "checked",
      source: this,
      stage: this.container,
      value: this.checked,
    });
    return this;
  }

  public pointClick(point: IInteractionPoint): void {
    this.toggle();
    return super.pointClick(point);
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

    this.cursor = this.hover ? Cursor.pointer : Cursor.auto;
    super.update();
  }

  public setText(text: string): this {
    this.text = text;
    return this;
  }
}
