import { Stage } from "../src/view/Stage";
import { AudioContext } from "web-audio-test-api";
import { Checkbox } from "../src/view/Checkbox"
import * as m from "../src/matrix";

import { setup } from "./setupUtil";

describe("Checkbox tests", () => {
  const x = 50;
  const y = 50;

  let stateTests;

  // setup before each test
  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t
        .addCheckbox("checkbox", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage());
  });

  // teardown after each test
  afterEach(() => {
  })

  // TODO: check that a checkbox has a width
  // TODO: assert that update() guarantees the cursor to be changed

  test("If a checkbox is added to the stage after the point is moved, the collision is still registered", () => {
    let { sprites: {checkbox} } = setup()
      .addInteractionPoint("ip")
      .movePoint("ip", x, y)
      .addCheckbox("checkbox", x, y)
      .updateStage()
      .values;
    
    expect(checkbox.cursor).toBe("pointer");
  });

  // tests asserting that all states of the checkbox are achievable

  test("State 'Active_Hover_Checked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
        .pointDown("ip", x, y)
      ).run().values;
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Active_Hover_Checked");
  });
  
  test("State 'Inactive_Hover_Checked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
        .movePoint("ip", x, y)
      ).run().values;
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Inactive_Hover_Checked");
  });
  
  test("State 'Active_NoHover_Checked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
        .pointDown("ip", x, y)
        .movePoint("ip", 0, 0)
      ).run().values;
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Active_NoHover_Checked");
  });
  
  test("State 'Inactive_NoHover_Checked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
      ).run().values;
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Inactive_NoHover_Checked");
  });
  
  test("State 'Active_Hover_Unchecked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
        .pointDown("ip", x, y)
      ).run().values;
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Active_Hover_Unchecked");
  });
  
  test("State 'Inactive_Hover_Unchecked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
        .movePoint("ip", x, y)
      ).run().values;
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Inactive_Hover_Unchecked");
  });
  
  test("State 'Active_NoHover_Unchecked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
        .pointDown("ip", x, y)
        .movePoint("ip", 0, 0)
      ).run().values;
    
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Active_NoHover_Unchecked");
  });
  
  test("State 'Inactive_NoHover_Unchecked' is achievable", () => {
    let { sprites: {checkbox} } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
      ).run().values;
    
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Inactive_NoHover_Unchecked");
  });
});
