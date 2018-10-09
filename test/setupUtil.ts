/* tslint:disable:max-classes-per-file */
import { AudioContext } from "web-audio-test-api";
import { copy, Identity } from "../src/matrix";
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

/**
 * Create setup utility object.
 */
export function setup() {
  return new TestSetup();
}

/**
 * Shape of the "values" property of ITestSetup.
 */
export interface ITestSetupValues {
  sprites: { [id: string]: ISprite; };
  points: { [id: string]: IInteractionPoint; };
  callbacks: { [id: string]: jest.Mock; };
  stage: IStage;
}

/**
 * Test setup builder.
 */
export interface ITestSetup {
  /**
   * Variables created during the setup procedure.
   *
   * Modified by the setup methods.
   */
  values: ITestSetupValues;

  /**
   * Setup configuration template.
   *
   * A template has one or more placeholder instances into which the user can
   * feed a sequence of actions to be performed in that point of the setup. When
   * all placeholders have been filled, the setup can be completed.
   */
  template: ITestSetupTemplate;

  /**
   * Create an InteractionPoint with the given id and add it to the stage.
   */
  addInteractionPoint(id: string, pointType: "Touch" | "Mouse"): this;

  /**
   * Create a Button with the given id at the given (x, y) coordinate and add it
   * to the stage.
   */
  addButton(id: string, x: number, y: number): this;

  /**
   * Create a Panel with the given id at the given (x, y) coordinate and add it
   * to the stage.
   */
  addPanel(id: string, x: number, y: number): this;

  /**
   * Add a sprite by id to a given panel by id.
   */
  addSpriteToPanel(sprite: string, panel: string): this;

  /**
   * Create a jest callback attached to a sprite specified by it's id.
   */
  addEventCallback(id: string, eventProperty: string, sprite: string): this;

  /**
   * Create a jest callback attached to the stage
   */
  addStageEventCallback(id: string, eventProperty: string): this;
  /**
   * Create a Close button with the given id at the given (x, y) coordinate and
   * add it to the stage.
   *
   * NOTE: The Close button has the same states as the regular Button sans the
   * "Selected" part.
   */

  addCloseButton(id: string, x: number, y: number): this;

  /**
   * Create a Checkbox with the given id at the given (x, y) coordinate and add
   * it to the stage.
   */
  addCheckbox(id: string, x: number, y: number): this;

  /**
   * Create a Label with the given id at the given (x, y) coordinate and add it
   * to the stage.
   */
  addLabel(id: string, x: number, y: number): this;

  /**
   * Create a slider with the given id at the given (x, y) coordinate and add it
   * to the stage.
   */
  addSlider(id: string, x: number, y: number): this;

  /**
   * Create a textInput with the given id at the given (x, y) coordinate and add it
   * to the stage.
   */
  addTextInput(id: string, x: number, y: number): this;

  /**
   * Move the given point to the given (x, y) coordinate.
   */
  pointMove(id: string, x: number, y: number): this;

  /**
   * Set the "selected" property of a button to be true or false.
   */
  setSelected(id: string, val: boolean): this;

  /**
   * Set the "text" property of a label to a given string.
   */
  setLabelText(id: string, val: string): this;

  /**
   * Set the textures of a given sprite to the specified image value.
   *
   * If no textureNames are specified, the method assumes that all textures
   * should have their value changed. Else, it only changes the ones specified
   * in textureNames.
   */
  setTextures(id: string, val: ImageBitmap | HTMLImageElement, ...textureNames: string[]): this;

  /**
   * Call the stage update() method.
   */
  updateStage(): this;
  renderStage(): this;

  /**
   * Point down method, used to put the point down
   */
  pointDown(id: string, x: number, y: number): this;

  /**
   * Point up method, used to put the point up
   */
  pointUp(id: string, x: number, y: number): this;

  /**
   * setSize method. Used to artificially set the size of the sprite
   */
  setSize(id: string, width: number, height: number): this;

  /**
   * setChecked method. Used to artificially set the checked property of a checkbox
   */
  setChecked(id: string, val: boolean): this;

  /**
   * focus method. Used to artificially focus a sprite
   */
  focus(id: string): this;

  /**
   * keyDown method. Used to artificially fire a key down event
   */
  keyDown(key: string): this;

  textInputSelectRange(id: string, begin: number, end: number): this;
}

export interface ITestSetupTemplate {
  /**
   * Feed a setup configuration template.
   *
   * This inserts actions at the correct points in time for the placeholders.
   * Each call to feed() consumes a placeholder. When all placeholders have been
   * consumed, the template can be completed using run().
   *
   * Throws an error if attempting to feed more actions after having consumed
   * all placeholders.
   */
  feed(actions: TestSetupTemplateCallback): this;

  /**
   * Indicates that a sequence of setup actions should be injected.
   */
  placeholder(): this;

  /**
   * Continue adding actions to the template.
   */
  perform(actions: TestSetupTemplateCallback): this;

  /**
   * Run the setup template after placeholders have been consumed.
   *
   * Throws an error if not all placeholders have been consumed.
   */
  run(): ITestSetup;

}

export class TestSetupValues implements ITestSetupValues {
  public sprites: { [id: string]: ISprite } = {};
  public points: { [id: string]: IInteractionPoint } = {};
  public callbacks: { [id: string]: jest.Mock; } = {};
  public stage: IStage = null;

  constructor() {
    const audioContext = new AudioContext();
    const canvas = document.createElement("canvas");
    this.stage = new Stage({
      audioContext,
      canvas,
      height: 600,
      width: 800,
    });
  }
}

export class TestSetup implements ITestSetup {
  public values: ITestSetupValues = null;
  public template: ITestSetupTemplate = null;

  constructor() {
    this.values = new TestSetupValues();
    this.template = new TestSetupTemplate();
  }

  public addInteractionPoint(id: string, pointType: "Touch" | "Mouse"): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add InteractionPoint with id ${id}: element with id already exists.`);
    }

    this.values.points[id] = this.values.stage.createInteractionPoint(id, pointType);
    this.values.stage.addPoint(this.values.points[id]);
    return this;
  }

  public addEventCallback(id: string, eventProperty: string, sprite: string): this {
    const target: any = this.values.sprites[sprite];
    if (!target) {
      throw new Error(`Cannot attach callback ${id} => ${eventProperty} to falsy sprite.`);
    }
    if (!this.values.callbacks[id]) {
      this.values.callbacks[id] = jest.fn();
    }
    target[eventProperty].listen(this.values.callbacks[id]);
    return this;
  }

  public addStageEventCallback(id: string, eventProperty: string): this {
    const target: any = this.values.stage;
    if (!this.values.callbacks[id]) {
      this.values.callbacks[id] = jest.fn();
    }
    target[eventProperty].listen(this.values.callbacks[id]);
    return this;
  }
  public pointMove(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot move InteractionPoint with id ${id}: point does not exist.`);
    }

    this.values.stage.pointMove(
      this.values.points[id],
      { clientX: x, clientY: y } as MouseEvent | Touch,
    );
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

    this.values.sprites[id] = new Button({
      definition: null,
      id,
      position: buttonPos,
      source: null,
      textures,
    });
    this.values.stage.addSprite(this.values.sprites[id]);
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

    const panel = this.values.sprites[id] = new Panel({
      alpha: 1,
      definition: null,
      id,
      position: panelPos,
      source: null,
      textures,
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

    this.values.sprites[id] = new Close({
      definition: null,
      id,
      position: buttonPos,
      source: null,
      textures,
    });
    this.values.stage.addSprite(this.values.sprites[id]);
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

    this.values.sprites[id] = new Checkbox({
      definition: null,
      id,
      position: checkboxPos,
      source: null,
      textures,
    });
    this.values.stage.addSprite(this.values.sprites[id]);
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

    this.values.sprites[id] = new Label({
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
    this.values.stage.addSprite(this.values.sprites[id]);
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

    this.values.sprites[id] = new Slider({
      definition: null,
      id,
      position: sliderPos,
      source: null,
      textures,
      width: 100,
    });
    this.values.stage.addSprite(this.values.sprites[id]);
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

    this.values.sprites[id] = ti;
    this.values.stage.addSprite(ti);
    return this;
  }
  public setSelected(id: string, val: boolean): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'selected' property of Button with id ${id}: button does not exist.`);
    }
    const button = this.values.sprites[id] as IButton;
    button.selected = val;

    return this;
  }

  public setLabelText(id: string, val: string): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'text' property of Label with id ${id}: label does not exist.`);
    }
    const label = this.values.sprites[id] as ILabel;
    label.setText(val);
    return this;
  }

  public setChecked(id: string, val: boolean): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'checked' property of Checkbox with id ${id}: checkbox does not exist.`);
    }
    if (this.values.sprites[id].type !== SpriteType.Checkbox) {
      throw new Error(`Cannot set the 'checked' property of Sprite with id ${id}: sprite is not a checkbox.`);
    }
    const checkbox = this.values.sprites[id] as ICheckbox;
    checkbox.checked = val;
    return this;
  }

  public setTextures(id: string, val: ImageBitmap, ...textureNames: string[]): this {
    const textures: string[] = textureNames.length ? textureNames : Object.keys(this.values.sprites[id].textures);
    for (const texture of textures) {
      this.values.sprites[id].textures[texture] = val;
    }
    return this;
  }

  public pointDown(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot execute pointDown on point with id ${id}: point dows not exist.`);
    }
    this.values.stage.pointDown(
      this.values.points[id],
      { clientX: x, clientY: y } as MouseEvent | Touch,
    );
    return this;
  }

  public pointUp(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot execute pointUp on point with id ${id}: point does not exist.`);
    }
    this.values.stage.pointUp(
      this.values.points[id],
      { clientX: x, clientY: y } as MouseEvent | Touch,
    );
    return this;
  }

  public setSize(id: string, width: number, height: number): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot resize sprite with id ${id}: sprite does not exist`);
    }
    this.values.sprites[id].width = width;
    this.values.sprites[id].height = height;
    return this;
  }

  public updateStage(): this {
    this.values.stage.update();
    return this;
  }

  public addSpriteToPanel(sprite: string, panel: string): this {
    if (!this.values.sprites[sprite]) {
      throw new Error(`Sprite id: ${sprite} does not exist.`);
    }
    if (!this.values.sprites[panel]) {
      throw new Error(`Sprite id: ${panel} does not exist.`);
    }
    if (this.values.sprites[panel].type !== SpriteType.Panel) {
      throw new Error(`Sprite id: ${panel} is not a panel.`);
    }

    const targetSprite = this.values.sprites[sprite];
    const targetPanel = this.values.sprites[panel] as IPanel;

    targetPanel.addSprite(targetSprite);
    return this;
  }
  public renderStage(): this {
    this.values.stage.render();
    return this;
  }

  public focus(id: string): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot focus sprite ${id}: sprite does not exist.`);
    }
    this.values.stage.setFocus(this.values.sprites[id]);
    return this;
  }

  public keyDown(key: string): this {
    this.values.stage.keyDown({
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
    if (this.values.sprites[id].type !== SpriteType.TextInput) {
      throw new Error(`Cannot set input range: sprite ${id} is not a TextInput`);
    }

    const ti = this.values.sprites[id] as ITextInput;
    ti.select(begin, end);
    return this;
  }

  /* Convenience methods to ease readability */

  private idIsTaken(id: string): boolean {
    return this.existsPoint(id) || this.existsSprite(id);
  }

  private existsPoint(id: string): boolean {
    return this.values.points.hasOwnProperty(id);
  }

  private existsSprite(id: string): boolean {
    return this.values.sprites.hasOwnProperty(id);
  }
}

export class TestSetupTemplate implements ITestSetupTemplate {
  private actions: TestSetupTemplateCallback[] = [];

  public feed(actions: TestSetupTemplateCallback): this {
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i] === null) {
        this.actions[i] = actions;
        return this;
      }
    }
    throw new Error("Error calling 'feed': no placeholder to consume.");
  }

  public placeholder(): this {
    this.actions.push(null);
    return this;
  }

  public perform(actions: TestSetupTemplateCallback): this {
    this.actions.push(actions);
    return this;
  }

  public run(): ITestSetup {
    return this.actions.reduce((acc, action) => action(acc), setup());
  }
}

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

// custom type: TestSetupTemplateCallback
type TestSetupTemplateCallback = (template: ITestSetup) => ITestSetup;
