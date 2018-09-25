import { TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ITextInput extends ISprite {
  text: string;
  font: string;
  fontSize: number;
  fontColor: string;
  caretIndex: number;
  caretX: number;
  selection: [number, number];
  textScroll: number;
  padding: [number, number, number, number];
  frameCount: number;
  setText(text: string): this;
}

export interface ITextInputProps extends ISpriteProps {
  text?: string;
  font?: string;
  fontSize?: number;
  fontColor?: string;
  width: number;
  height: number;
}

const tempctx = document.createElement("canvas").getContext("2d");

export class TextInput extends Sprite implements ITextInput {
  public text: string = "";
  public font: string = "monospace";
  public fontSize: number = 12;
  public fontColor: string = "black";
  public caretIndex: number = 0;
  public caretX: number = 0;
  public selection: [number, number] = [0, 0];
  public textScroll: number = 0;
  public padding: [number, number, number, number] = [2, 2, 2, 2];
  public frameCount: number = 0;
  private showCaret: boolean = true;

  constructor(props: ITextInputProps) {
    super(props);
    this.text = props.text || this.text;
    this.font = props.font || this.font;
    this.fontSize = props.fontSize || this.fontSize;
    this.fontColor = props.fontColor || this.fontColor;
    this.width = props.width || this.width;
    this.height = props.height || this.height;
  }

  public update(): void {
    tempctx.font = `${this.fontSize}px ${this.font}`;
    const textWidth: number = tempctx.measureText(this.text).width;
    this.caretX = tempctx.measureText(this.text.slice(0, this.caretIndex)).width;
    const relativeCaretX: number = this.caretX + this.textScroll;
    const maxTextWidth: number  = this.width - this.padding[0] - this.padding[1];

    if (relativeCaretX < 0) {
      console.log("hit less than 0");
      this.textScroll += relativeCaretX;
    } else if (relativeCaretX > maxTextWidth) {
      console.log("hit greater than");
      this.textScroll -= relativeCaretX - maxTextWidth;
    }

    this.frameCount += 1;
    if (this.frameCount >= 30) {
      this.frameCount = 0;
      this.showCaret = !this.showCaret;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, this.width, this.height);

    // clip
    ctx.beginPath();
    ctx.rect(
      this.padding[0],
      this.padding[2],
      this.width - this.padding[1] - this.padding[0],
      this.width - this.padding[3],
    );
    ctx.clip();

    // draw text
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.textBaseline = TextBaseline.top;
    ctx.fillText(this.text, this.textScroll + this.padding[0], 0);

    if (this.showCaret) {
      const caretX = this.textScroll + this.padding[0] + this.caretIndex;
      ctx.beginPath();
      ctx.moveTo(caretX, this.padding[2]);
      ctx.lineTo(caretX, this.height - this.padding[3]);
      ctx.stroke();
    }
  }

  public setText(text: string): this {
    this.text = text;
    return this;
  }
}
