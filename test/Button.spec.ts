import { Stage } from "../src/view/Stage";
import { AudioContext } from "web-audio-test-api";
import { Button } from "../src/view/Button"
import * as m from "../src/matrix";

/**
 * Helper function: create a new Stage with a fresh audio context.
 */
const createStage = () : IStage => {
  const audioContext = new AudioContext();
  const canvas = document.createElement("canvas");
  return new Stage({
    audioContext,
    canvas,
    height: 600,
    width: 800,
  });
};

/**
 * Helper function: create a button at 50,50.
 */
const createButton = (id: string, x: number, y: number): Button => {
  const buttonPos = m.chain([1, 0, 0, 1, 0, 0]).translate(x, y).value;
  
  const textures = {};
  ["Active", "Inactive"].forEach(a => {
    ["Hover", "NoHover"].forEach(b => {
      ["Selected", "Unselected"].forEach(c => {
        textures[`${a}_${b}_${c}`] = new Image();
      })
    })
  });
  
  // create button
  // NOTE: it needs a texture
  const button = new Button({
    definition: null, // TODO: change?
    id,
    position: buttonPos,
    source: null, // TODO: change?
    textures,
  });
  return button;
};

/**
 * Helper function: create and add an interaction point to the interaction
 * manager, then return it.
 */
const addPointToInteractionManager = (im: IInteractionManager): IInteractionPoint => {
  const ip = im.createInteractionPoint("pointName", "Touch");
  im.addPoint(ip);
  return ip;
};

describe("Button tests", () => {
  const x = 50;
  const y = 50;

  const touch = {clientX: x, clientY: y};
  
  let stage : IStage = null;
  
  // setup before each test
  beforeEach(() => {
    stage = createStage();
  });

  // teardown after each test
  afterEach(() => {
    stage = null;
  })

  // TODO: check that a button has a width
  // TODO: assert that update() guarantees the cursor to be changed

  test("If a button is added to the stage after the point is moved, the collision is still registered", () => {
    const ip = addPointToInteractionManager(stage);
    
    stage.pointMove(ip, touch);
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    stage.update();
    expect(button.cursor).toBe("pointer");
  });

  // tests asserting that all states of the button are achievable

  test("State 'Active_Hover_Selected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = true;
    stage.pointDown(ip, touch); // cause both hover and active to happen
    
    stage.update();
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
  });
  test("State 'Inactive_Hover_Selected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = true;
    stage.pointMove(ip, touch); // cause hover
    
    stage.update();
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
  });
  test("State 'Active_NoHover_Selected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = true;
    stage.pointDown(ip, touch); // cause active
    stage.pointMove(ip, {clientX: 0, clientY: 0}); // cause nohover
    
    stage.update();
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
  });
  test("State 'Inactive_NoHover_Selected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = true;
    // NOTE: we don't move the point, so the button is not activated/hovered
    
    stage.update();
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
  });
  test("State 'Active_Hover_Unselected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = false;
    stage.pointDown(ip, touch); // cause both hover and active to happen
    
    stage.update();
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
  });
  test("State 'Inactive_Hover_Unselected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = false;
    stage.pointMove(ip, touch); // cause hover
    
    stage.update();
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
  });
  test("State 'Active_NoHover_Unselected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = false;
    stage.pointDown(ip, touch); // cause active
    stage.pointMove(ip, {clientX: 0, clientY: 0}); // cause nohover
    
    stage.update();
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
  });
  test("State 'Inactive_NoHover_Unselected' is achievable", () => {
    const button = createButton("button", x, y);
    stage.addSprite(button);
    
    const ip = addPointToInteractionManager(stage);

    button.selected = false;
    // NOTE: we don't move the point, so the button is not activated/hovered
    
    stage.update();
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
  });
});
