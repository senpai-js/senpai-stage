import { IKeyDownEvent } from "../events";
import { Cursor, IPadding, SpriteType, TextBaseline } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";
import { IStage } from "./Stage";

const unicodeCharacterTest = /^.$/u;
export enum SelectionState {
  Selection,
  Caret,
}

export interface ITextInput extends ISprite {
  text: string[];
  font: string;
  fontSize: number;
  fontColor: string;
  selectedFontColor: string;
  selectedFontBackgroundColor: string;
  selectionState: SelectionState;
  caretIndex: number;
  selectionStart: number;
  selectionEnd: number;
  caretX: number;
  padding: IPadding;
  frameCount: number;
  setText(text: string): this;
  select(begin: number, end: number): this;
}

export interface ITextInputProps extends ISpriteProps {
  text?: string;
  font?: string;
  fontSize?: number;
  fontColor?: string;
  selectedFontColor?: string;
  selectedFontBackgroundColor?: string;
  width: number;
}

const tempctx = document.createElement("canvas").getContext("2d");

export class TextInput extends Sprite implements ITextInput {
  public readonly type: SpriteType = SpriteType.TextInput;
  public text: string[] = [];
  public font: string = "monospace";
  public fontSize: number = 12;
  public fontColor: string = "black";
  public selectedFontColor = "white";
  public selectedFontBackgroundColor = "blue";
  public caretIndex: number = 0;
  public caretX: number = 0;
  public textScroll: number = 0;
  public selectionState: SelectionState = SelectionState.Caret;
  public padding: IPadding = {
    bottom: 8,
    left: 4,
    right: 4,
    top: 8,
  };
  public selectionEnd: number = -1;
  public selectionStart: number = -1;
  public frameCount: number = 0;
  public cursor: Cursor = Cursor.text;

  private showCaret: boolean = true;
  private focusedMidPattern: CanvasPattern = null;
  private unfocusedMidPattern: CanvasPattern = null;

  constructor(props: ITextInputProps) {
    super(props);
    this.text = props.text ? props.text.split("") : this.text;
    this.font = props.font || this.font;
    this.fontSize = props.fontSize || this.fontSize;
    this.fontColor = props.fontColor || this.fontColor;
    this.selectedFontBackgroundColor = props.selectedFontBackgroundColor || this.selectedFontBackgroundColor;
    this.selectedFontColor = props.selectedFontColor || this.selectedFontColor;
    this.width = props.width || this.width;
  }

  public update(): void {
    if (!this.focusedMidPattern && this.textures.Focused_Mid) {
      this.focusedMidPattern = tempctx.createPattern(this.textures.Focused_Mid as any, "repeat-x");
    }

    if (!this.unfocusedMidPattern && this.textures.Unfocused_Mid) {
      this.unfocusedMidPattern = tempctx.createPattern(this.textures.Unfocused_Mid as any, "repeat-x");
    }

    this.height = this.textures.Focused_Left.height;
    // count 30 frames, then flash the cursor
    this.frameCount += 1;
    if (this.frameCount >= 30) {
      this.showCaret = !this.showCaret;
      this.frameCount -= 30;
    }

    // set the relative caretX from the start of the text
    tempctx.font = `${this.fontSize}px ${this.font}`;
    this.caretX = tempctx.measureText(this.text.slice(0, this.caretIndex).join("")).width;

    // measure current caretX relative to the start of the TextInput padding
    const relativeCaretX = this.textScroll + this.caretX;

    const visibleTextWidth = this.width - this.padding.left - this.padding.right;

    if (relativeCaretX > visibleTextWidth) {
      this.textScroll = visibleTextWidth - this.caretX;
    }
    if (relativeCaretX < 0) {
      this.textScroll = -this.caretX;
    }

    this.showCaret = this.focused;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const stage = this.container as IStage;
    const left = this.focused ? this.textures.Focused_Left : this.textures.Unfocused_Left;
    const right = this.focused ? this.textures.Focused_Right : this.textures.Unfocused_Right;
    const pattern = this.focused ? this.textures.Focused_Mid : this.textures.Unfocused_Mid;
    ctx.drawImage(left, 0, 0);
    ctx.drawImage(right, this.width - right.width, 0);
    ctx.fillStyle = this.focused ? this.focusedMidPattern : this.unfocusedMidPattern;
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
      this.height - this.padding.bottom - this.padding.top,
    );
    ctx.clip();

    if (this.selectionState === SelectionState.Selection) {
      this.renderSelection(ctx);
    } else if (this.selectionState === SelectionState.Caret && stage.insertMode) {
      this.renderCaretInsert(ctx);
    } else if (this.selectionState === SelectionState.Caret) {
      this.renderCaret(ctx);
    }
  }

  public setText(text: string): this {
    this.text = text.split("");
    return this;
  }

  public keyDown(e: IKeyDownEvent): void {
    if (this.selectionState === SelectionState.Selection) {
      this.keyDownSelection(e);
    } else if ((this.container as IStage).insertMode && this.selectionState === SelectionState.Caret) {
      this.keyDownCaretInsert(e);
    } else if (this.selectionState === SelectionState.Caret) {
      this.keyDownCaret(e);
    }

    return super.keyDown(e);
  }
  public select(begin: number, end: number): this {
    if (!Number.isFinite(begin)) {
      throw new Error(`Cannot select text on sprite ${this.id}: begin is not finite`);
    }
    if (!Number.isFinite(end)) {
      throw new Error(`Cannot select text on sprite ${this.id}: end is not finite`);
    }
    begin = Math.floor(begin);
    if (this.text.length < begin || begin < 0) {
      throw new Error(`Cannot select text on sprite ${this.id}: begin is not in range`);
    }
    end = Math.floor(end);
    if (this.text.length < begin || begin < 0) {
      throw new Error(`Cannot select text on sprite ${this.id}: end is not in range`);
    }
    if (begin > end) {
      throw new Error(`Cannot select text on sprite ${this.id}: begin is greater than end`);
    }

    this.selectionState = SelectionState.Selection;
    this.selectionStart = begin;
    this.selectionEnd = end;
    this.caretIndex = Math.min(Math.max(begin, this.caretIndex), end);
    return this;
  }
  private keyDownCaret(e: IKeyDownEvent): void {
    if (unicodeCharacterTest.test(e.key)) {
      this.text.splice(this.caretIndex, 0, e.key);
      this.moveCaretRight();
      return;
    }

    switch (e.key) {
      case "Backspace":
        this.text.splice(this.caretIndex - 1, 1);
        this.moveCaretLeft();
        break;
      case "ArrowLeft":
        this.moveCaretLeft();
        break;
      case "ArrowRight":
        this.moveCaretRight();
        break;
    }
  }

  private keyDownCaretInsert(e: IKeyDownEvent): void {
    if (unicodeCharacterTest.test(e.key)) {
      this.text.splice(this.caretIndex, 1, e.key);
      this.moveCaretRight();
      return;
    }

    switch (e.key) {
      case "Backspace":
        this.text.splice(this.caretIndex, 1);
        this.moveCaretLeft();
        break;
      case "ArrowLeft":
        this.moveCaretLeft();
        break;
      case "ArrowRight":
        this.moveCaretRight();
        break;
    }
  }
  private keyDownSelection(e: IKeyDownEvent): void {
    if (unicodeCharacterTest.test(e.key)) {
      this.text.splice(this.selectionStart, this.selectionEnd - this.selectionStart, e.key);
      this.caretIndex = this.selectionStart + 1;
      this.selectionState = SelectionState.Caret;
      this.selectionStart = -1;
      this.selectionEnd = -1;
      return;
    }

    switch (e.key) {
      case "Backspace":
        this.text.splice(this.caretIndex, this.selectionEnd - this.selectionStart);
        this.caretIndex = this.selectionStart;
        this.selectionState = SelectionState.Caret;
        break;
      case "ArrowLeft":
        this.caretIndex = this.selectionStart;
        this.selectionState = SelectionState.Caret;
        break;
      case "ArrowRight":
        this.caretIndex = this.selectionEnd;
        this.selectionState = SelectionState.Caret;
        break;
    }
  }

  private renderCaret(ctx: CanvasRenderingContext2D): void {
    const text = this.text.join("");

    ctx.translate(
      this.padding.left + this.textScroll,
      this.padding.top,
    );
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.textBaseline = TextBaseline.hanging;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(text, 0, 0);

    if (this.showCaret) {
      ctx.beginPath();
      ctx.moveTo(this.caretX, 0);
      ctx.lineTo(this.caretX, this.height - this.padding.top - this.padding.bottom);
      ctx.stroke();
    }
  }

  private renderSelection(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontSize}px ${this.font}`;
    const firstText = this.text.slice(0, this.selectionStart).join("");
    const secondText = this.text.slice(this.selectionStart, this.selectionEnd).join("");
    const thirdText = this.text.slice(this.selectionEnd).join("");
    const firstMeasure = ctx.measureText(firstText).width;
    const secondMeasure = ctx.measureText(secondText).width;

    // pre-selected text
    ctx.textBaseline = TextBaseline.hanging;
    ctx.translate(
      this.padding.left + this.textScroll,
      this.padding.top,
    );
    ctx.fillStyle = this.fontColor;
    ctx.fillText(firstText, 0, 0);

    // selected text
    ctx.translate(firstMeasure, 0);
    ctx.fillStyle = this.selectedFontBackgroundColor;
    ctx.fillRect(0, 0, secondMeasure, this.height - this.padding.top - this.padding.bottom);
    ctx.fillStyle = this.selectedFontColor;
    ctx.fillText(secondText, 0, 0);

    // post-selected text
    ctx.translate(secondMeasure, 0);
    ctx.fillStyle = this.fontColor;
    ctx.fillText(thirdText, 0, 0);
  }

  private renderCaretInsert(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontSize}px ${this.font}`;
    const firstText = this.text.slice(0, this.caretIndex).join("");
    const secondText = this.text[this.caretIndex];
    const thirdText = this.text.slice(this.caretIndex + 1).join("");
    const firstMeasure = ctx.measureText(firstText).width;
    const secondMeasure = ctx.measureText(secondText).width;

    // pre-selected text
    ctx.textBaseline = TextBaseline.hanging;
    ctx.translate(
      this.padding.left + this.textScroll,
      this.padding.top,
    );
    ctx.fillStyle = this.fontColor;
    ctx.fillText(firstText, 0, 0);

    // selected text
    ctx.translate(firstMeasure, 0);
    ctx.fillStyle = this.selectedFontBackgroundColor;
    ctx.fillRect(0, 0, secondMeasure, this.height - this.padding.top - this.padding.bottom);
    ctx.fillStyle = this.selectedFontColor;
    ctx.fillText(secondText, 0, 0);

    // post-selected text
    ctx.translate(secondMeasure, 0);
    ctx.fillStyle = this.fontColor;
    ctx.fillText(thirdText, 0, 0);
  }

  private moveCaretLeft() {
    this.caretIndex -= 1;
    if (this.caretIndex < 0) {
      this.caretIndex = 0;
    }
  }

  private moveCaretRight() {
    this.caretIndex += 1;
    if (this.caretIndex > this.text.length) {
      this.caretIndex = this.text.length;
    }
  }
}
