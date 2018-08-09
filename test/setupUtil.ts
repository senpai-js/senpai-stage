import * as m from "../src/matrix";
import { Stage, IStage } from "../src/view/Stage"
import { ISprite } from "../src/view/Sprite"
import { Button } from "../src/view/Button"
import { ITextureMap, IInteractionPoint } from "../src/util"

class TextureBuilder implements ITextureBuilder {
  private sep: string = "_";
  private attributes: string[][] = [];
  
  public separator(sep: string): this {
    this.sep = sep;
    return this;
  }
  
  public attr(...variations: string[]): this {
    if (variations.length == 0)
      throw new Error("Cannot add empty list of attribute variations");
    
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
  addInteractionPoint(id:string): this;
  
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
  
  constructor() {
    this.values = new TestSetupValues();
  }
  
  public addInteractionPoint(id: string) : this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add InteractionPoint with id ${id}: element with id already exists`);
    }
    
    this.values.points[id] = this.values.stage.createInteractionPoint(id, "Touch");
    this.values.stage.addPoint(this.values.points[id]);
    return this;
  }
  
  public movePoint(id: string, x : number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot move InteractionPoint with id ${id}: point does not exist`);
    }
    
    this.values.stage.pointMove(this.values.points[id], {clientX: x, clientY: y});
    return this;
  }

  public addButton(id: string, x: number, y: number): this {
    if (this.idIsTaken(id)) {
      throw new Error(`Cannot add Button with id ${id}: element with id already exists`);
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
      throw new Error(`Cannot set the 'selected' property of Button with id ${id}: button does not exist`);
    }

    this.values.sprites[id].selected = val;
    return this;
  }

  public pointDown(id: string, x: number, y: number): this {
    if (!this.existsPoint(id)) {
      throw new Error(`Cannot execute pointDown on point with id ${id}: point dows not exist`);
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
      throw new Error("Cannot add empty list of attribute variations");
    
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
