import * as m from "../src/matrix";
import { Stage, IStage } from "../src/view/Stage"
import { ISprite } from "../src/view/Sprite"
import { Button } from "../src/view/Button"
import { ITextureMap, IInteractionPoint } from "../src/util"

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
   * Create an InteractionPoint with the given id and add it to the stage.
   */
  addInteractionPoint(id: string): this;
  
  /**
   * Create a Button with the given id at the given (x, y) coordinate and add it
   * to the stage.
   */
  addButton(id: string, x: number, y: number): this;
  
  /**
   * Move the given point to the given (x, y) coordinate.
   */
  movePoint(id: string, x: number, y: number): this;

  /**
   * Set the "selected" property of a button to be true or false.
   */
  setSelected(id: string, val: boolean): this;

  /**
   * Call the stage update() method.
   */
  updateStage(): this;

  /**
   * Setup configuration template.
   *
   * A template has one or more placeholder instances into which the user can
   * feed a sequence of actions to be performed in that point of the setup. When
   * all placeholders have been filled, the setup can be completed.
   */
  template: ITestSetupTemplate;
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
  public sprites : { [id: string]: ISprite } = {};
  public points : { [id: string]: IInteractionPoint } = {};
  public stage : IStage = null;
  
  constructor() {
    const audioContext = new AudioContext();
    const canvas = document.createElement("canvas");
    this.stage = new Stage({
      audioContext,
      canvas,
      height: 600,
      width: 800
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
  
  public addInteractionPoint(id: string) : this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add InteractionPoint with id ${id}: element with id already exists.`);
    }
    
    this.values.points[id] = this.values.stage.createInteractionPoint(id, "Touch");
    this.values.stage.addPoint(this.values.points[id]);
    return this;
  }
  
  public movePoint(id: string, x : number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot move InteractionPoint with id ${id}: point does not exist.`);
    }
    
    this.values.stage.pointMove(this.values.points[id], {clientX: x, clientY: y});
    return this;
  }

  public addButton(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Button with id ${id}: element with id already exists.`);
    }

    const buttonPos = m.chain([1, 0, 0, 1, 0, 0]).translate(x, y).value;
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

  public setSelected(id: string, val: boolean): this {
    if (!this.existsSprite(id)) {
      throw new Error(`Cannot set the 'selected' property of Button with id ${id}: button does not exist.`);
    }

    this.values.sprites[id].selected = val;
    return this;
  }

  public pointDown(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot execute pointDown on point with id ${id}: point dows not exist.`);
    }
    this.values.stage.pointDown(this.values.points[id], {clientX: x, clientY: y});
    return this;
  }

  public updateStage(): this {
    this.values.stage.update();
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
  
  constructor() { }
  
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

class TextureBuilder implements ITextureBuilder {
  private sep: string = "_";
  private attributes: string[][] = [];
  
  public separator(sep: string): this {
    this.sep = sep;
    return this;
  }
  
  public attr(...variations: string[]): this {
    if (variations.length == 0)
      throw new Error("Cannot add empty list of attribute variations.");
    
    this.attributes.push(variations.slice());
    return this;
  }
  
  public build(): ITextureMap {
    if (this.attributes.length == 0)
      return {}; // empty texture map
    
    // theme for this section: idk if we have to make a copy, but I'm doing it
    // to be safe
    let textures = this.attributes[0].slice();
    this.attributes.slice(1).forEach(attribute => {
      const temp = [];
      textures.forEach(texture => attribute.forEach(variation => temp.push(texture+this.sep+variation)));
      textures = temp.slice();
    });
    return textures.reduce((acc, x) => {acc[x] = new Image(); return acc}, {});
  }
}

// custom type: TestSetupTemplateCallback
type TestSetupTemplateCallback = (template: ITestSetup) => ITestSetup
