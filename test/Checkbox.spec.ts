import { Stage } from "../src/view/Stage";
import { AudioContext } from "web-audio-test-api";
import { Checkbox } from "../src/view/Checkbox"
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
 * Helper function: create a checkbox at 50,50.
 */
const createCheckbox = (id: string, x: number, y: number): Checkbox => {
  const checkboxPos = m.chain([1, 0, 0, 1, 0, 0]).translate(x, y).value;
  
  const textures = {};
  ["Active", "Inactive"].forEach(a => {
    ["Hover", "NoHover"].forEach(b => {
      ["Checked", "Unchecked"].forEach(c => {
        textures[`${a}_${b}_${c}`] = new Image();
      })
    })
  });
  
  // create checkbox
  // NOTE: it needs a texture
  const checkbox = new Checkbox({
    definition: null, // TODO: change?
    id,
    position: checkboxPos,
    source: null, // TODO: change?
    textures,
  });
  return checkbox;
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

describe("Checkbox tests", () => {
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

  // TODO: check that a checkbox has a width
  // TODO: assert that update() guarantees the cursor to be changed

  test("If a checkbox is added to the stage after the point is moved, the collision is still registered", () => {
    const ip = addPointToInteractionManager(stage);
    
    stage.pointMove(ip, touch);
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    stage.update();
    expect(checkbox.cursor).toBe("pointer");
  });

  // tests asserting that all states of the checkbox are achievable

  test("State 'Active_Hover_Checked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = true;
    stage.pointDown(ip, touch); // cause both hover and active to happen
    
    stage.update();
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(true);
  });
  test("State 'Inactive_Hover_Checked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = true;
    stage.pointMove(ip, touch); // cause hover
    
    stage.update();
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(true);
  });
  test("State 'Active_NoHover_Checked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = true;
    stage.pointDown(ip, touch); // cause active
    stage.pointMove(ip, {clientX: 0, clientY: 0}); // cause nohover
    
    stage.update();
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(true);
  });
  test("State 'Inactive_NoHover_Checked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = true;
    // NOTE: we don't move the point, so the checkbox is not activated/hovered
    
    stage.update();
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(true);
  });
  test("State 'Active_Hover_Unchecked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = false;
    stage.pointDown(ip, touch); // cause both hover and active to happen
    
    stage.update();
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(false);
  });
  test("State 'Inactive_Hover_Unchecked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = false;
    stage.pointMove(ip, touch); // cause hover
    
    stage.update();
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(false);
  });
  test("State 'Active_NoHover_Unchecked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = false;
    stage.pointDown(ip, touch); // cause active
    stage.pointMove(ip, {clientX: 0, clientY: 0}); // cause nohover
    
    stage.update();
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(false);
  });
  test("State 'Inactive_NoHover_Unchecked' is achievable", () => {
    const checkbox = createCheckbox("checkbox", x, y);
    stage.addSprite(checkbox);
    
    const ip = addPointToInteractionManager(stage);

    checkbox.checked = false;
    // NOTE: we don't move the point, so the checkbox is not activated/hovered
    
    stage.update();
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(false);
  });
});
