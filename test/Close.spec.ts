import { setup } from "./setupUtil";

describe("Close button tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // setup template for state test cases
  let stateTests;

  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t
        .addCloseButton("button", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage());
  });
  
  afterEach(() => {
  }); // why am I even creating this thing?

  test("If a close button is added to the stage after the point is moved, the collision is still registered", () => {
    let { sprites: {button} } = setup()
      .addInteractionPoint("ip")
      .movePoint("ip", x, y)
      .addCloseButton("button", x, y)
      .updateStage()
      .values;

    expect(button.cursor).toBe("pointer");
  });

  test("State 'Active_Hover' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .pointDown("ip", x, y) // activate button
      ).run().values;

    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.texture).toBe("Active_Hover");
  });
  
  test("State 'Inactive_Hover' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .movePoint("ip", x, y) // hover
      ).run().values;
    
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.texture).toBe("Inactive_Hover");
  });
  
  test("State 'Active_NoHover' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        .pointDown("ip", x, y) // activate
        .movePoint("ip", 0, 0) // unhover
      ).run().values;

    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.texture).toBe("Active_NoHover");
  });
  
  test("State 'Inactive_NoHover' is achievable", () => {
    let { sprites: {button} } = stateTests
      .feed(t => t
        // literally do nothing
      ).run().values;

    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.texture).toBe("Inactive_NoHover");
  });
});
