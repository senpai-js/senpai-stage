import { Stage } from "../src/view/Stage";
import { AudioContext } from "web-audio-test-api";
import { Button } from "../src/view/Button"
import * as m from "../src/matrix";

import { setup } from "./setupUtil";

describe("Button tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // create a setup template for the very similar state test cases
  let stateTests;
  
  // setup before each test
  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t
        .addButton("button", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage());
  });

  // teardown after each test
  afterEach(() => {
  })

  // TODO: check that a button has a width
  // TODO: assert that update() guarantees the cursor to be changed

  test("If a button is added to the stage after the point is moved, the collision is still registered", () => {
    let { sprites: {button} } = setup()
      .addInteractionPoint("ip")
      .movePoint("ip", x, y)
      .addButton("button", x, y)
      .updateStage()
      .values;

    expect(button.cursor).toBe("pointer");
  });

  // tests asserting that all states of the button are achievable

  test("State 'Active_Hover_Selected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", true)
        .pointDown("ip", x, y) // activate button
      ).run().values;
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Active_Hover_Selected");
  });
  
  test("State 'Inactive_Hover_Selected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", true)
        .movePoint("ip", x, y) // hover over button
      ).run().values;
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Inactive_Hover_Selected");
  });
  
  test("State 'Active_NoHover_Selected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", true)
        .pointDown("ip", x, y) // activate button
        .movePoint("ip", 0, 0) // move away from button to unhover
      ).run().values;
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Active_NoHover_Selected");
  });
  
  test("State 'Inactive_NoHover_Selected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", true)
      ).run().values;
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Inactive_NoHover_Selected");
  });
  
  test("State 'Active_Hover_Unselected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointDown("ip", x, y)
      ).run().values;
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Active_Hover_Unselected");
  });
  
  test("State 'Inactive_Hover_Unselected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", false)
        .movePoint("ip", x, y)
      ).run().values;
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Inactive_Hover_Unselected");
  });
  
  test("State 'Active_NoHover_Unselected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointDown("ip", x, y)
        .movePoint("ip", 0, 0)
      ).run().values;
    
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Active_NoHover_Unselected");
  });
  
  test("State 'Inactive_NoHover_Unselected' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .setSelected("button", false)
      ).run().values;
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Inactive_NoHover_Unselected");
  });
});
