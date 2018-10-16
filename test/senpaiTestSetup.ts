/* tslint:disable:max-classes-per-file */
import { AudioContext } from "web-audio-test-api";
import { CanvasMatrix2D, copy, Identity, use } from "../src/matrix";
import { ITextureMap } from "../src/spritesheet";
import { IInteractionPoint, SpriteType, TextAlign, TextBaseline } from "../src/util";
import { Button, IButton } from "../src/view/Button";
import { Checkbox, ICheckbox } from "../src/view/Checkbox";
import { Close } from "../src/view/Close";
import { ILabel, Label } from "../src/view/Label";
import { IPanel, Panel } from "../src/view/Panel";
import { Slider } from "../src/view/Slider";
import { ISprite } from "../src/view/Sprite";
import { IStage, Stage } from "../src/view/Stage";
import { ITextInput, TextInput } from "../src/view/TextInput";

// helper class: ITextureBuilder
interface ITextureBuilder {

  /**
   * Expose the attributes property on ITexture builder because it's used externally.
   */
  attributes: string[][];
  /**
   * Ability to customize separator.
   */
  separator(sep: string): this;

  /**
   * Add a variable attribute to the texture builder.
   *
   * NOTE: Call-order sensitive
   * this.attr(["a", "b"]).attr(["c, d"]) results in "a_c", "a_d", "b_c", "b_d",
   * not in "c_a", "c_b", "d_a", "d_b"
   */
  attr(...variations: string[]): this;

  /**
   * Create the texture map.
   */
  build(): ITextureMap;
}

/**
 * This is a helper class which can chain together multiple texture builders and
 * use them to build a single ITextureMap.
 */
interface ITextureChainBuilder extends ITextureBuilder {
  /**
   * Create a new texture builder.
   */
  and(): this;

  /**
   * Use the current texture builder's attributes as the basis of a new texture
   * builder with more attributes.
   */
  sometimes(): this;

  /**
   * Delegate to current texture builder.
   */
  attr(...variations: string[]): this;

  /**
   * Delegate to current texture builder.
   */
  separator(sep: string): this;

  /**
   * Create single texture map from all texture builders.
   */
  build(): ITextureMap;
}

class TextureBuilder implements ITextureBuilder {
  public attributes: string[][] = [];
  private sep: string = "_";

  constructor(attr?: string[][]) {
    if (attr) {
      this.attributes = attr.slice();
    }
  }

  public separator(sep: string): this {
    this.sep = sep;
    return this;
  }

  public attr(...variations: string[]): this {
    if (variations.length === 0) {
      throw new Error("Cannot add empty list of attribute variations.");
    }

    this.attributes.push(variations.slice());
    return this;
  }

  public build(): ITextureMap {
    if (this.attributes.length === 0) {
      return {};
    } // empty texture map

    // theme for this section: idk if we have to make a copy, but I'm doing it
    // to be safe
    let textures = this.attributes[0].slice();
    this.attributes.slice(1).forEach(attribute => {
      const temp = [];
      textures.forEach(texture => attribute.forEach(variation => temp.push(texture + this.sep + variation)));
      textures = temp.slice();
    });
    return textures.reduce((acc, x) => {acc[x] = new Image(); return acc; }, {});
  }
}

class TextureChainBuilder implements ITextureChainBuilder {
  public attributes: string[][] = [];
  private builders: ITextureBuilder[] = [new TextureBuilder()];

  public and(): this {
    this.builders.push(new TextureBuilder());
    return this;
  }

  public sometimes(): this {
    this.builders.push(new TextureBuilder(this.currentBuilder().attributes));
    return this;
  }

  public separator(sep: string): this {
    this.currentBuilder().separator(sep);
    return this;
  }

  public attr(...variations: string[]): this {
    this.currentBuilder().attr(...variations);
    return this;
  }

  public build(): ITextureMap {
    const tm: ITextureMap = {};
    this.builders.forEach(b => {
      const tmp = b.build();
      for (const texture of Object.keys(tmp)) {
        tm[texture] = tmp[texture];
      }
    });
    return tm;
  }

  private currentBuilder(): ITextureBuilder {
    return this.builders[this.builders.length - 1];
  }
}

export type ActionCallback = (suite: TestSetup) => TestSetup;

export enum ActionType {
  Placeholder,
  Action,
}

export interface IAction {
  type: ActionType;
  action: ActionCallback;
}

export class TestSetup {
  public stage: IStage = null;
  public sprites: { [id: string]: ISprite; } = {};
  public points: { [id: string]: IInteractionPoint; } = {};
  public callbacks: { [id: string]: jest.Mock; } = {};

  public actions: IAction[] = [];

  constructor() {
    const audioContext = new AudioContext();
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    this.stage = new Stage({
      audioContext,
      canvas,
      height: 600,
      width: 800,
    });
  }

  public perform(...callbacks: ActionCallback[]): this {
    this.actions.push(
      ...callbacks.map(
        action => ({
          action,
          type: ActionType.Action,
        }),
      ),
    );
    return this;
  }

  public feed(...callbacks: ActionCallback[]): this {
    callbacks.forEach(action => {
      for (let i = 0; i < this.actions.length; i++) {
        if (this.actions[i].type === ActionType.Placeholder) {
          this.actions[i] = {
            action,
            type: ActionType.Action,
          };
          return;
        }
      }
      throw new Error("Could not find placeholder to replace, did you forget to call TestSetup.placeholder()?");
    });
    return this;
  }

  public placeholder(): this {
    this.actions.push({
      action: null,
      type: ActionType.Placeholder,
    });
    return this;
  }

  public run(): this {
    for (const action of this.actions) {
      if (action.type === ActionType.Placeholder) {
        throw new Error("Invalid action type: Placeholder. Did you forget to feed an action");
      }
      action.action(this);
    }
    return this;
  }

  public dispose(): this {
    this.stage.canvas.parentElement.removeChild(this.stage.canvas);
    this.stage.dispose();
    return this;
  }

  public addInteractionPoint(id: string, pointType: "Touch" | "Mouse"): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add InteractionPoint with id ${id}: element with id already exists.`);
    }

    this.points[id] = this.stage.createInteractionPoint(id, pointType);
    this.stage.addPoint(this.points[id]);
    return this;
  }

  public addEventCallback(id: string, eventProperty: string, sprite: string): this {
    const target: any = this.sprites[sprite];
    if (!target) {
      throw new Error(`Cannot attach callback ${id} => ${eventProperty} to falsy sprite.`);
    }
    if (!this.callbacks[id]) {
      this.callbacks[id] = jest.fn();
    }
    target[eventProperty].listen(this.callbacks[id]);
    return this;
  }

  public addStageEventCallback(id: string, eventProperty: string): this {
    const target: any = this.stage;
    if (!this.callbacks[id]) {
      this.callbacks[id] = jest.fn();
    }
    target[eventProperty].listen(this.callbacks[id]);
    return this;
  }
  public pointMove(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot move InteractionPoint with id ${id}: point does not exist.`);
    }

    this.stage.pointMove(
      this.points[id],
      { clientX: x, clientY: y } as MouseEvent | Touch,
    );
    return this;
  }

  public pointCancel(id: string): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot cancel InteractionPoint with id ${id}: point does not exist.`);
    }
    const point = this.points[id];
    this.stage.pointCancel(point, {
      clientX: point.x,
      clientY: point.y,
    } as MouseEvent | Touch);
    return this;
  }
  public addButton(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Button with id ${id}: element with id already exists.`);
    }

    const buttonPos = copy(Identity).translate(x, y).value;
    const textures = new TextureBuilder()
      .attr("Active", "Inactive")
      .attr("Hover", "NoHover")
      .attr("Selected", "Unselected")
      .build();

    this.sprites[id] = new Button({
      definition: null,
      id,
      position: buttonPos,
      source: null,
      textures,
    });
    this.stage.addSprite(this.sprites[id]);
    return this;
  }

  public addPanel(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Panel with id ${id}: element with id already exists.`);
    }

    const panelPos = copy(Identity).translate(x, y).value;
    const textures = new TextureBuilder()
      .attr("texture")
      .build();

    const panel = this.sprites[id] = new Panel({
      alpha: 1,
      definition: null,
      height: 100,
      id,
      position: panelPos,
      source: null,
      textures,
      width: 100,
      z: 1,
    });
    panel.width = 100;
    panel.height = 100;
    return this;
  }

  public addCloseButton(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Close button with id ${id}: element with id already exists.`);
    }

    const buttonPos = copy(Identity).translate(x, y).value;
    const textures = new TextureBuilder()
      .attr("Active", "Inactive")
      .attr("Hover", "NoHover")
      .build();

    this.sprites[id] = new Close({
      definition: null,
      id,
      position: buttonPos,
      source: null,
      textures,
    });
    this.stage.addSprite(this.sprites[id]);
    return this;
  }

  public addCheckbox(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Checkbox with id ${id}: element with id already exists.`);
    }
    const checkboxPos = copy(Identity).translate(x, y).value;
    const textures = new TextureBuilder()
      .attr("Active", "Inactive")
      .attr("Hover", "NoHover")
      .attr("Checked", "Unchecked")
      .build();

    this.sprites[id] = new Checkbox({
      definition: null,
      id,
      position: checkboxPos,
      source: null,
      textures,
    });
    this.stage.addSprite(this.sprites[id]);
    return this;
  }

  public addLabel(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Label with id ${id}: element with id already exists.`);
    }
    const labelPos = copy(Identity).translate(x, y).value;
    const textures = new TextureBuilder()
      .attr("texture")
      .build();

    this.sprites[id] = new Label({
      alpha: 1,
      definition: null,
      font: "monospace",
      fontColor: "black",
      fontSize: 12,
      id,
      position: labelPos,
      source: null,
      text: "",
      textAlign: TextAlign.left,
      textBaseline: TextBaseline.top,
      textures,
      z: 0,
    });
    this.stage.addSprite(this.sprites[id]);
    return this;
  }

  public addSlider(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Slider with id ${id}: element with id already exists.`);
    }
    const sliderPos = copy(Identity).translate(x, y).value;
    const textures = new TextureChainBuilder()
      .attr("Pill")
      .sometimes()
      .attr("Active", "Hover")
      .and()
      .attr("Line")
      .sometimes()
      .attr("Cap")
      .attr("Left", "Right")
      .build();
    const t: any = textures;
    t.Pill_Active.height
       = t.Pill_Hover.height
       = t.Pill.height = 20;
    t.Pill_Active.width
       = t.Pill_Hover.width
       = t.Pill.width = 20;

    this.sprites[id] = new Slider({
      definition: null,
      id,
      position: sliderPos,
      source: null,
      textures,
      value: 0,
      width: 100,
    });
    this.stage.addSprite(this.sprites[id]);
    return this;
  }

  public addTextInput(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add TextInput with id ${id}: element with id already exists.`);
    }
    const ti = new TextInput({
      definition: null,
      id,
      position: [1, 0, 0, 1, x, y],
      source: null,
      width: 100,
    });

    ti.textures = new TextureChainBuilder()
      .attr("Focused", "Unfocused")
      .attr("Left", "Mid", "Right")
      .build();

    this.sprites[id] = ti;
    this.stage.addSprite(ti);
    return this;
  }
  public setSelected(id: string, val: boolean): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'selected' property of Button with id ${id}: button does not exist.`);
    }
    const button = this.sprites[id] as IButton;
    button.selected = val;

    return this;
  }

  public setPosition(id: string, position: CanvasMatrix2D): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set position of sprite ${id}: sprite does not exist.`);
    }
    use(this.sprites[id].interpolatedPosition).set(position);
    return this;
  }
  public setLabelText(id: string, val: string): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'text' property of Label with id ${id}: label does not exist.`);
    }
    const label = this.sprites[id] as ILabel;
    label.setText(val);
    return this;
  }

  public setChecked(id: string, val: boolean): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'checked' property of Checkbox with id ${id}: checkbox does not exist.`);
    }
    if (this.sprites[id].type !== SpriteType.Checkbox) {
      throw new Error(`Cannot set the 'checked' property of Sprite with id ${id}: sprite is not a checkbox.`);
    }
    const checkbox = this.sprites[id] as ICheckbox;
    checkbox.checked = val;
    return this;
  }

  public setTextures(id: string, val: any, ...textureNames: string[]): this {
    const textures: string[] = textureNames.length ? textureNames : Object.keys(this.sprites[id].textures);
    for (const texture of textures) {
      this.sprites[id].textures[texture] = val;
    }
    return this;
  }

  public toggleCheckbox(sprite: string): this {
    if (!this.existsSprite(sprite)) {
      throw new Error(`Cannot toggle checkbox with id ${sprite}: sprite does not exist.`);
    }
    const cb = this.sprites[sprite];
    if (cb.type !== SpriteType.Checkbox) {
      throw new Error(`Cannot toggle checkbox with id ${sprite}: sprite is not a checkbox.`);
    }
    (cb as ICheckbox).toggle();
    return this;
  }
  public pointDown(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot execute pointDown on point with id ${id}: point dows not exist.`);
    }
    this.stage.pointDown(
      this.points[id],
      { clientX: x, clientY: y } as MouseEvent | Touch,
    );
    return this;
  }

  public pointUp(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot execute pointUp on point with id ${id}: point does not exist.`);
    }
    this.stage.pointUp(
      this.points[id],
      { clientX: x, clientY: y } as MouseEvent | Touch,
    );
    return this;
  }

  public setSize(id: string, width: number, height: number): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot resize sprite with id ${id}: sprite does not exist`);
    }
    this.sprites[id].width = width;
    this.sprites[id].height = height;
    return this;
  }

  public updateStage(): this {
    this.stage.update();
    return this;
  }

  public addSpriteToPanel(sprite: string, panel: string): this {
    if (!this.sprites[sprite]) {
      throw new Error(`Sprite id: ${sprite} does not exist.`);
    }
    if (!this.sprites[panel]) {
      throw new Error(`Sprite id: ${panel} does not exist.`);
    }
    if (this.sprites[panel].type !== SpriteType.Panel) {
      throw new Error(`Sprite id: ${panel} is not a panel.`);
    }

    const targetSprite = this.sprites[sprite];
    const targetPanel = this.sprites[panel] as IPanel;

    targetPanel.addSprite(targetSprite);
    return this;
  }
  public renderStage(): this {
    this.stage.render();
    return this;
  }

  public focus(id: string): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot focus sprite ${id}: sprite does not exist.`);
    }
    this.stage.setFocus(this.sprites[id]);
    return this;
  }

  public keyDown(key: string): this {
    this.stage.keyDown({
      altKey: false,
      ctrlKey: false,
      key,
      shiftKey: false,
    });
    return this;
  }

  public keyPress(key: string): this {
    this.stage.keyPress({
      altKey: false,
      ctrlKey: false,
      key,
      shiftKey: false,
    });
    return this;
  }

  public textInputSelectRange(id: string, begin: number, end: number) {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set input range: sprite ${id} doesn't exist`);
    }
    if (this.sprites[id].type !== SpriteType.TextInput) {
      throw new Error(`Cannot set input range: sprite ${id} is not a TextInput`);
    }

    const ti = this.sprites[id] as ITextInput;
    ti.select(begin, end);
    return this;
  }

  public mockSpritePrototypeFunction(id: string, sprite: string, funcName: string): this {
    if (!this.existsSprite(sprite)) {
      throw new Error(`Cannot mock ${funcName} on sprite ${sprite}: sprite does not exist`);
    }

    const ctx: any = this.sprites[sprite];
    const cb = this.callbacks[id] || jest.fn();
    this.callbacks[id] = cb;
    ctx[funcName] = cb;
    return this;
  }

  public mockContextPrototypeFunction(id: string, funcName: string): this {
    const ctx: any = this.stage.ctx;
    const cb = this.callbacks[id] || jest.fn();
    this.callbacks[id] = cb;
    ctx[funcName] = cb;
    return this;
  }

  public mockStagePrototypeFunction(id: string, funcName: string): this {
    const stage: any = this.stage;
    const func = this.stage[funcName];
    const cb = this.callbacks[id] || jest.fn(
      (...args) => func.apply(this.stage, args),
    );
    this.callbacks[id] = cb;
    stage[funcName] = cb;
    return this;
  }

  public dispatchMouseEvent(type: string, clientX: number, clientY: number): this {
    const { canvas } = this.stage;
    const evt = new MouseEvent(type, { clientX, clientY, bubbles: true });
    canvas.dispatchEvent(evt);
    return this;
  }

  public dispatchWindowMouseEvent(type: string, clientX: number, clientY: number): this {
    const { canvas } = this.stage;
    const evt = new MouseEvent(type, { clientX, clientY });
    window.dispatchEvent(evt);
    return this;
  }

  public dispatchTouchEvent(type: string, clientX: number, clientY: number): this {
    const { canvas } = this.stage;
    const touch = {
      clientX,
      clientY,
      identifier: 0,
      target: canvas,
    } as any;
    const evt = new TouchEvent(type, {
      bubbles: true,
      changedTouches: [touch],
      touches: [touch],
    });
    canvas.dispatchEvent(evt);
    return this;
  }

  public dispatchWindowTouchEvent(type: string, clientX: number, clientY: number): this {
    const { canvas } = this.stage;
    const evt = new TouchEvent(type, {
      bubbles: true,
      touches: [
        {
          clientX,
          clientY,
          identifier: 0,
          target: window,
        } as any,
      ],
    });
    window.dispatchEvent(evt);
    return this;
  }

  public dispatchKeyEvent(type: string, key: string, altKey: boolean, shiftKey: boolean, ctrlKey: boolean): this {
    const { canvas } = this.stage;
    const evt = new KeyboardEvent(type, {
      altKey,
      bubbles: true,
      ctrlKey,
      key,
      shiftKey,
    });
    canvas.dispatchEvent(evt);
    return this;
  }

  public dispatchWindowKeyEvent(type: string, key: string, altKey: boolean, shiftKey: boolean, ctrlKey: boolean): this {
    const { canvas } = this.stage;
    const evt = new KeyboardEvent(type, {
      altKey,
      bubbles: true,
      ctrlKey,
      key,
      shiftKey,
    });
    canvas.dispatchEvent(evt);
    return this;
  }

  public disposeStage(): this {
    this.stage.dispose();
    return this;
  }

  /* Convenience methods to ease readability */

  private idIsTaken(id: string): boolean {
    return this.existsPoint(id) || this.existsSprite(id);
  }

  private existsPoint(id: string): boolean {
    return this.points.hasOwnProperty(id);
  }

  private existsSprite(id: string): boolean {
    return this.sprites.hasOwnProperty(id);
  }
}

export function setup() {
  return new TestSetup();
}
