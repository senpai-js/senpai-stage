import { Cursor } from "../src/util";
import { ITestSetupTemplate, setup } from "./setupUtil";

describe("Close button tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // setup template for state test cases
  let stateTests: ITestSetupTemplate;

  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t
        .addCloseButton("button", x, y)
        .addInteractionPoint("ip", "Touch"))
      .placeholder()
      .perform(t => t
        .updateStage());
  });

  test("If a close button is added to the stage after the point is moved, the collision is still registered", () => {
    const { values } = setup()
      .addInteractionPoint("ip", "Touch")
      .pointMove("ip", x, y)
      .addCloseButton("button", x, y)
      .updateStage()
      .renderStage();

    expect(values.stage.canvas.style.cursor).toStrictEqual(Cursor.pointer);
  });

  test("State 'Active_Hover' is achievable", () => {
    const { sprites: { button } } = stateTests
      .feed(t => t
        .pointDown("ip", x, y), // activate button
      ).run().values;

    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.texture).toBe("Active_Hover");
  });

  test("State 'Inactive_Hover' is achievable", () => {
    const { sprites: { button } } = stateTests
      .feed(t => t
        .pointMove("ip", x, y), // hover
      ).run().values;

    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.texture).toBe("Inactive_Hover");
  });

  test("State 'Active_NoHover' is achievable", () => {
    const { sprites: { button } } = stateTests
      .feed(t => t
        .pointDown("ip", x, y) // activate
        .pointMove("ip", 0, 0), // unhover
      ).run().values;

    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.texture).toBe("Active_NoHover");
  });

  test("State 'Inactive_NoHover' is achievable", () => {
    const { sprites: { button } } = stateTests
      .feed(t => t).run().values;
        // literally do nothing

    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.texture).toBe("Inactive_NoHover");
  });
});
