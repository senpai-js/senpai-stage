import { IKeyDownEvent } from "../events";
import { IPadding, SpriteType, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export enum SelectionState {
  Selection,
  Caret,
}

export interface ITextInput extends ISprite {
  text: string;
  font: string;
  fontSize: number;
  fontColor: string;
  selectionState: SelectionState;
  caretIndex: number;
  selectionEnd: number;
  caretX: number;
  padding: IPadding;
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
  public readonly type: SpriteType = SpriteType.TextInput;
  public text: string = "";
  public font: string = "monospace";
  public fontSize: number = 12;
  public fontColor: string = "black";
  public caretIndex: number = 0;
  public caretX: number = 0;
  public textScroll: number = 0;
  public selectionState: SelectionState = SelectionState.Caret;
  public padding: IPadding = {
    bottom: 2,
    left: 2,
    right: 2,
    top: 2,
  };
  public selectionEnd: number = -1;
  public frameCount: number = 0;
  private showCaret: boolean = true;
  private activeMidPattern: CanvasPattern = null;
  private inactiveMidPattern: CanvasPattern = null;

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
    // noOp
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const left = this.active ? this.textures.Active_Left : this.textures.Inactive_Left;
    const right = this.active ? this.textures.Active_Right : this.textures.Inactive_Right;
    const pattern = this.active ? this.textures.Active_Mid : this.textures.Inactive_Mid;
    ctx.drawImage(this.textures.Left_Cap_Active, 0, 0);
    ctx.drawImage(left, 0, 0);
    ctx.drawImage(right, this.width - right.width, 0);
    ctx.fillStyle = this.active ? this.activeMidPattern : this.inactiveMidPattern;
    ctx.fillRect(
      left.width,
      0,
      this.width - left.width - right.width,
      pattern.height,
    );

    // clip
    ctx.beginPath();
    ctx.rect(
      this.padding.left,
      this.padding.top,
      this.width - this.padding.right - this.padding.left,
      this.width - this.padding.bottom,
    );
    ctx.clip();

    // draw text
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.fontColor;
    ctx.textBaseline = TextBaseline.top;
    ctx.fillText(this.text, this.textScroll + this.padding.left, 0);

    if (this.showCaret) {
      const caretX = this.textScroll + this.padding.left + this.caretIndex;
      ctx.beginPath();
      ctx.moveTo(caretX, this.padding.top);
      ctx.lineTo(caretX, this.height - this.padding.bottom);
      ctx.stroke();
    }
  }

  public setText(text: string): this {
    this.text = text;
    return this;
  }

  public keyDown(e: IKeyDownEvent) {
    const isSelection = this.selectionState === SelectionState.Selection;
    const end = isSelection ? this.selectionEnd : this.caretIndex;
    if (e.key.codePointAt(1) === void 0) {
      this.text = this.text.slice(0, this.caretIndex) + e.key + this.text.slice(end);
      this.selectionState = SelectionState.Caret;
      super.keyDown(e);
      return;
    }

    switch (e.key) {
      case "Backspace":
        this.text = isSelection
          ? this.text.slice(0, this.caretIndex) + this.text.slice(end)
          : this.text.slice(0, this.caretIndex - 1) + this.text.slice(this.caretIndex);
    }
    super.keyDown(e);
  }
}
