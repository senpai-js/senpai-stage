import { IKeyDownEvent } from "../events";
import { Cursor, IInteractionPoint, IPadding, SpriteType, TextBaseline } from "../util";
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
    left: 8,
    right: 6,
    top: 10,
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
    return point.tx > this.padding.left
      && point.ty > this.padding.top
      && point.tx < (this.width - this.padding.right)
      && point.ty < (this.height - this.padding.bottom)
      ? this
      : null;
  }

  public update(): void {
    if (!this.focused) {
      this.selectionState = SelectionState.Caret;
    }

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
    if (this.selectionState === SelectionState.Caret) {
      this.caretX = tempctx.measureText(this.text.slice(0, this.caretIndex).join("")).width;
    } else {
      const selectionTarget = this.caretIndex === this.selectionStart
        ? this.selectionEnd
        : this.selectionStart;
      this.caretX = tempctx.measureText(this.text.slice(0, selectionTarget).join("")).width
    }

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

  public pointCollision(point: IInteractionPoint): boolean {
    let str = "";
    if (point.firstDown) {
      this.caretIndex = 0;
      tempctx.font = `${this.fontSize}px ${this.font}`;
      // tslint:disable:prefer-for-of
      for (let i = 0; i < this.text.length; i++) {
        str += this.text[i];
        if ((tempctx.measureText(str).width + this.textScroll) > point.tx) {
          break;
        }
        this.caretIndex += 1;
      }
    } else if (this.active) {
      let idx = 0;
      for (let i = 0; i < this.text.length; i++) {
        str += this.text[i];
        if ((tempctx.measureText(str).width + this.textScroll) > point.tx) {
          break;
        }
        idx += 1;
      }
      if (idx !== this.caretIndex) {
        this.select(
          Math.min(idx, this.caretIndex),
          Math.max(idx, this.caretIndex),
        );
      } else {
        this.selectionState = SelectionState.Caret;
      }
    }
    return super.pointCollision(point);
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
      case "Delete":
        this.text.splice(this.caretIndex, 1);
        break;
      case "ArrowLeft":
        if (e.shift) {
          const end = this.caretIndex - 1;
          if (end < 0) {
            break;
          }
          this.select(end, this.caretIndex);
          break;
        }
        this.moveCaretLeft();
        break;
      case "ArrowRight":
        if (e.shift) {
          const end = this.caretIndex + 1;
          if (end > this.text.length) {
            break;
          }
          this.select(this.caretIndex, end);
          break;
        }
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
        this.text.splice(this.caretIndex - 1, 1);
        this.moveCaretLeft();
        break;
      case "Delete":
        this.text.splice(this.caretIndex, 1);
        break;
      case "ArrowLeft":
        if (e.shift) {
          const end = this.caretIndex - 1;
          if (end < 0) {
            break;
          }
          this.select(end, this.caretIndex);
          break;
        }
        this.moveCaretLeft();
        break;
      case "ArrowRight":
        if (e.shift) {
          const end = this.caretIndex + 1;
          if (end > this.text.length) {
            break;
          }
          this.select(this.caretIndex, end);
          break;
        }
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
        if (e.shift) {
          const start = this.caretIndex;
          const end = (this.selectionStart === this.caretIndex ? this.selectionEnd : this.selectionStart) - 1;
          if (end < 0) {
            break;
          }
          if (start === end) {
            this.selectionState = SelectionState.Caret;
            break;
          }
          this.select(
            Math.min(start, end),
            Math.max(start, end),
          );
          break;
        }
        this.caretIndex = this.selectionStart;
        this.selectionState = SelectionState.Caret;
        break;
      case "ArrowRight":
        if (e.shift) {
          const start = this.caretIndex;
          const end = (this.selectionStart === this.caretIndex ? this.selectionEnd : this.selectionStart) + 1;
          if (end > this.text.length) {
            break;
          }
          if (start === end) {
            this.selectionState = SelectionState.Caret;
            break;
          }
          this.select(
            Math.min(start, end),
            Math.max(start, end),
          );
          break;
        }
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
