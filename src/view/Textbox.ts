import assert from "assert";
import { createTextureMap, ILoadProps, IPadding, ITextureMap, loadImage, TextAlign, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

const tempctx = document.createElement("canvas").getContext("2d");

export interface ITextbox extends ISprite {
  text: string;
  textSpeed: number;
  textIndex: number;
  padding: IPadding;
  fontSize: number;
  font: string;
  fontColor: string;
  lineHeight: number;
  textAlign: TextAlign;
  textBaseline: TextBaseline;

  setText(text: string): this;
  appendText(text: string): this;
}

export interface ITextboxProps extends ISpriteProps {
  text?: string;
  textSpeed?: number;
  textIndex?: number;
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
  padding?: IPadding;
  fontSize?: number;
  font?: string;
  fontColor?: string;
  lineHeight?: number;
}

export class Textbox extends Sprite implements ITextbox {
  private static regex: RegExp = /\r\n|\r|\n|[^\t ]*[\t ]?/g;

  public text: string = "";
  public textSpeed: number = 1;
  public textIndex: number = 0;
  public padding: IPadding = {
    bottom: 5,
    left: 5,
    right: 5,
    top: 5,
  };
  public fontSize: number = 12;
  public font: string = "monospace";
  public fontColor: string = "black";
  public lineHeight: number = 16;
  public textAlign: TextAlign = TextAlign.left;
  public textBaseline: TextBaseline = TextBaseline.hanging;
  private interpolatedText: string[] = [""];

  constructor(props: ITextboxProps) {
    super(props);
    this.text = props.text || this.text;
    this.textSpeed = props.textSpeed || this.textSpeed;
    if (props.hasOwnProperty("textIndex")) {
      this.textIndex = props.textIndex;
    }
    this.padding = props.padding || this.padding;
    this.fontSize = props.fontSize || this.fontSize;
    this.font = props.font || this.font;
    this.fontColor = props.fontColor || this.fontColor;
    this.lineHeight = props.lineHeight || this.lineHeight;

    this.setTexture("Texture");
  }

  public update() {
    const maxWidth = this.texture.width - this.padding.left - this.padding.right;
    this.textIndex = Math.min(this.text.length, this.textIndex + this.textSpeed);
    const words = this.text.match(Textbox.regex);
    this.interpolatedText = [""];
    const maxLines = (this.texture.height - this.padding.top - this.padding.bottom) / this.lineHeight;
    let line: string = "";
    let lineIndex: number = 0;
    let measurement: TextMetrics;
    let leftOver: number = this.textIndex;
    tempctx.font = `${this.fontSize}px ${this.font}`;

    for (const word of words) {

      // If the next character is a newline, push a new line
      if (word === "\n" || word === "\r\n" || word === "\r") {
        this.interpolatedText.push("");
        leftOver -= word.length;
        lineIndex += 1;
        continue;
      }

      line = this.interpolatedText[lineIndex];

      // If there are no more characters to push, break
      if (leftOver === 0) {
        break;
      }

      // If the line count is greater than the maximum number of lines, break
      if ((lineIndex + 1) > maxLines) {
        break;
      }

      // Test the word length
      line += word;
      measurement = tempctx.measureText(line);

      // If the line overflows
      if (measurement.width > maxWidth) {
        lineIndex = this.interpolatedText.push("") - 1;
      }

      this.interpolatedText[lineIndex] += word;
      // Add the text to the screen

      leftOver -= word.length;

      if (leftOver < 0) {
        this.interpolatedText[lineIndex] = this.interpolatedText[lineIndex].slice(0, leftOver);
        break;
      }
      // Check to see if the word overFlows the animation
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    const maxHeight = this.texture.height - this.padding.top;
    let currentHeight = this.padding.top;

    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;

    ctx.beginPath();
    ctx.rect(
      this.padding.left,
      this.padding.bottom,
      this.width - this.padding.right,
      this.height - this.padding.top,
    );
    ctx.clip();
    for (const line of this.interpolatedText) {
      if (currentHeight + this.fontSize > maxHeight) {
        break;
      }

      ctx.fillText(line, this.padding.left, currentHeight);
      currentHeight += this.lineHeight;
    }
  }

  public setText(text: string): this {
    if (text.startsWith(this.text)) {
      this.text = text;
      return this;
    }

    this.text = text;
    this.interpolatedText = [""];
    this.textIndex = 0;
    return this;
  }

  public appendText(text: string): this {
    this.text += text;
    return this;
  }

  public skipAnimation(now: number): boolean {
    const result: boolean = super.skipAnimation(now) && this.textIndex < this.text.length;
    this.textIndex = this.text.length;
    return result;
  }
}

export interface ILoadTextboxProps extends ITextboxProps, ILoadProps {

}

export async function loadTextbox(props: ILoadTextboxProps): Promise<ITextbox> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  assert(textures.Texture);

  props.textures = textures;
  const textbox = new Textbox(props);

  return textbox;
}
