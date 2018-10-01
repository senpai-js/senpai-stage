import { Cursor, SpriteType } from "../src/util";
import { IButton } from "../src/view/Button";
import { ITestSetupTemplate, setup } from "./setupUtil";

describe("Button tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // create a setup template for the very similar state test cases
  let stateTests: ITestSetupTemplate;

  // setup before each test
  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t
        .addButton("button", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  test("Button Sprite Types should be SpriteType.Button", () => {
    const { values } = stateTests.feed(t => t.pointMove("ip", x, y)).run();
    expect(values.sprites.button.type).toStrictEqual(SpriteType.Button);
  });

  test("If a button is added to the stage after the point is moved, the collision is still registered", () => {
    const { values } = setup()
      .addInteractionPoint("ip")
      .pointMove("ip", x, y)
      .addButton("button", x, y)
      .updateStage()
      .renderStage();

    expect(values.stage.canvas.style.cursor).toBe(Cursor.pointer);
  });

  // tests asserting that all states of the button are achievable

  test("State 'Active_Hover_Selected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", true)
        .pointDown("ip", x, y), // activate button
      ).run();
    const button = values.sprites.button as IButton;

    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Active_Hover_Selected");
  });

  test("State 'Inactive_Hover_Selected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", true)
        .pointMove("ip", x, y), // hover over button
      ).run();
    const button = values.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Inactive_Hover_Selected");
  });

  test("State 'Active_NoHover_Selected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", true)
        .pointDown("ip", x, y) // activate button
        .pointMove("ip", 0, 0), // move away from button to unhover
      ).run();
    const button = values.sprites.button as IButton;
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Active_NoHover_Selected");
  });

  test("State 'Inactive_NoHover_Selected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", true),
      ).run();
    const button = values.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Inactive_NoHover_Selected");
  });

  test("State 'Active_Hover_Unselected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointDown("ip", x, y),
      ).run();

    const button = values.sprites.button as IButton;
    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Active_Hover_Unselected");
  });

  test("State 'Inactive_Hover_Unselected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointMove("ip", x, y),
      ).run();
    const button = values.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Inactive_Hover_Unselected");
  });

  test("State 'Active_NoHover_Unselected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointDown("ip", x, y)
        .pointMove("ip", 0, 0),
      ).run();
    const button = values.sprites.button as IButton;
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Active_NoHover_Unselected");
  });

  test("State 'Inactive_NoHover_Unselected' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setSelected("button", false),
      ).run();
    const button = values.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Inactive_NoHover_Unselected");
  });

});
