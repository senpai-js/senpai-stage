import { IKeyDownEvent, IKeyPressEvent } from "../events";
import { transformPoint } from "../matrix";
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
  textScroll: number;
  showCaret: boolean;
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
    bottom: 6,
    left: 6,
    right: 6,
    top: 6,
  };
  public selectionEnd: number = -1;
  public selectionStart: number = -1;
  public frameCount: number = 0;
  public cursor: Cursor = Cursor.text;

  public showCaret: boolean = true;
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

  public isHovering(point: IInteractionPoint, now: number): ISprite {
    this.interpolate(now);
    transformPoint(point, this.inverse);
    if (this.broadPhase(point)) {
      return this.narrowPhase(point);
    }
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
      this.caretX = tempctx.measureText(this.text.slice(0, selectionTarget).join("")).width;
    }

    // measure current caretX relative to the start of the TextInput padding
    const relativeCaretX = this.textScroll + this.caretX;
    const fullTextWidth = tempctx.measureText(this.text.join("")).width;
    const visibleTextWidth = this.width - this.padding.left - this.padding.right;
    const targetCharacter = this.selectionState === SelectionState.Caret
      ? this.caretIndex
      : (this.selectionEnd === this.caretIndex ? this.selectionStart : this.selectionEnd);
    if (fullTextWidth < visibleTextWidth) {
      this.textScroll = 0;
    } else if (relativeCaretX > visibleTextWidth - 5) {
      const charWidth = targetCharacter >= this.text.length
        ? 0
        : tempctx.measureText(this.text[targetCharacter]).width;
      this.textScroll = visibleTextWidth - this.caretX - charWidth;
    } else if (relativeCaretX < 5) {
      const charWidth = targetCharacter <= 0
        ? 0
        : tempctx.measureText(this.text[targetCharacter - 1]).width;
      this.textScroll = -this.caretX + charWidth;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const stage = this.getStage();
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
    const stage = this.getStage();
    if (this.selectionState === SelectionState.Selection) {
      this.keyDownSelection(e);
    } else if (stage && stage.insertMode && this.selectionState === SelectionState.Caret) {
      this.keyDownCaretInsert(e);
    } else if (this.selectionState === SelectionState.Caret) {
      this.keyDownCaret(e);
    }

    return super.keyDown(e);
  }

  public keyPress(e: IKeyPressEvent): void {
    const stage = this.getStage();
    if (this.selectionState === SelectionState.Selection) {
      this.keyPressSelection(e);
    } else if (stage && stage.insertMode && this.selectionState === SelectionState.Caret) {
      this.keyPressCaretInsert(e);
    } else if (this.selectionState === SelectionState.Caret) {
      this.keyPressCaret(e);
    }

    return super.keyPress(e);
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
    const str = "";
    if (point.firstDown) {
      this.caretIndex = this.getCaretIndex(point.tx);
    } else if (this.active) {
      const idx = this.getCaretIndex(point.tx);
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

  private keyPressCaret(e: IKeyPressEvent) {
    if (unicodeCharacterTest.test(e.key)) {
      this.text.splice(this.caretIndex, 0, e.key);
      this.moveCaretRight();
      return;
    }
  }
  private keyDownCaret(e: IKeyDownEvent): void {
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
      case "End":
        if (e.shift) {
          const end = this.text.length;
          if (end !== this.caretIndex) {
            this.select(this.caretIndex, end);
          }
          break;
        }
        this.caretIndex = this.text.length;
        break;
      case "Home":
        if (e.shift) {
          if (this.caretIndex !== 0) {
            this.select(0, this.caretIndex);
          }
          break;
        }
        this.caretIndex = 0;
        break;
    }
  }

  private keyPressCaretInsert(e: IKeyPressEvent): void {
    if (unicodeCharacterTest.test(e.key)) {
      this.text.splice(this.caretIndex, 1, e.key);
      this.moveCaretRight();
      return;
    }
  }
  private keyDownCaretInsert(e: IKeyDownEvent): void {
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
      case "End":
        if (e.shift) {
          const end = this.text.length;
          if (end !== this.caretIndex) {
            this.select(this.caretIndex, end);
          }
          break;
        }
        this.caretIndex = this.text.length;
        break;
      case "Home":
        if (e.shift) {
          if (this.caretIndex !== 0) {
            this.select(0, this.caretIndex);
          }
          break;
        }
        this.caretIndex = 0;
        break;
    }
  }
  private keyPressSelection(e: IKeyPressEvent): void {
    if (unicodeCharacterTest.test(e.key)) {
      this.text.splice(this.selectionStart, this.selectionEnd - this.selectionStart, e.key);
      this.caretIndex = this.selectionStart + 1;
      this.selectionState = SelectionState.Caret;
      this.selectionStart = -1;
      this.selectionEnd = -1;
      return;
    }
  }
  private keyDownSelection(e: IKeyDownEvent): void {

    switch (e.key) {
      case "Delete":
      case "Backspace":
        this.text.splice(this.selectionStart, this.selectionEnd - this.selectionStart);
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
        case "End":
        if (e.shift) {
          const end = this.text.length;
          if (end !== this.caretIndex) {
            this.select(this.caretIndex, end);
          }
          break;
        }
        this.caretIndex = this.text.length;
        this.selectionState = SelectionState.Caret;
        break;
      case "Home":
        if (e.shift) {
          if (this.caretIndex !== 0) {
            this.select(0, this.caretIndex);
          }
          break;
        }
        this.caretIndex = 0;
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
    ctx.fillStyle = this.fontColor;
    ctx.textBaseline = TextBaseline.middle;
    const midline = (this.height - this.padding.top - this.padding.bottom) * 0.5;
    ctx.fillText(text, 0, midline);

    if (this.showCaret && this.focused) {
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
    ctx.textBaseline = TextBaseline.middle;
    const midline = (this.height - this.padding.top - this.padding.bottom) * 0.5;
    ctx.translate(
      this.padding.left + this.textScroll,
      this.padding.top + midline,
    );
    ctx.fillStyle = this.fontColor;
    ctx.fillText(firstText, 0, 0);

    // selected text
    ctx.translate(firstMeasure, 0);
    ctx.fillStyle = this.selectedFontBackgroundColor;
    ctx.fillRect(0, -midline, secondMeasure, this.height - this.padding.top - this.padding.bottom);
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
    ctx.textBaseline = TextBaseline.middle;
    const midline = (this.height - this.padding.top - this.padding.bottom) * 0.5;
    ctx.translate(
      this.padding.left + this.textScroll,
      this.padding.top + midline,
    );
    ctx.fillStyle = this.fontColor;
    ctx.fillText(firstText, 0, 0);

    if (!secondText) {
      if (this.showCaret && this.focused) {
        ctx.beginPath();
        ctx.moveTo(this.caretX, -midline);
        ctx.lineTo(this.caretX, this.height - this.padding.top - this.padding.bottom - midline);
        ctx.stroke();
      }
      return;
    }
    // selected text
    ctx.translate(firstMeasure, 0);
    ctx.fillStyle = this.selectedFontBackgroundColor;
    ctx.fillRect(0, -midline, secondMeasure, this.height - this.padding.top - this.padding.bottom);
    ctx.fillStyle = this.selectedFontColor;
    ctx.fillText(secondText, 0, 0);

    if (!thirdText) {
      return;
    }
    // post-selected text
    ctx.translate(secondMeasure, 0);
    ctx.fillStyle = this.fontColor;
    ctx.fillText(thirdText, 0, 0);
  }

  private moveCaretLeft() {
    this.caretIndex -= 1;
    this.frameCount = 0;
    this.showCaret = true;
    if (this.caretIndex < 0) {
      this.caretIndex = 0;
    }
  }

  private moveCaretRight() {
    this.caretIndex += 1;
    this.frameCount = 0;
    this.showCaret = true;
    if (this.caretIndex > this.text.length) {
      this.caretIndex = this.text.length;
    }
  }

  private getCaretIndex(relativeX: number): number {
    tempctx.font = `${this.fontSize}px ${this.font}`;
    let idx = 0;
    let str = "";
    // tslint:disable:prefer-for-of
    for (let i = 0; i < this.text.length; i++) {
      str += this.text[i];
      if ((tempctx.measureText(str).width + this.textScroll) > relativeX) {
        return idx;
      }
      idx += 1;
    }
    return this.text.length;
  }
}
