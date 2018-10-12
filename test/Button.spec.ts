import { Cursor, SpriteType } from "../src/util";
import { IButton } from "../src/view/Button";
import { setup, TestSetup } from "./senpaiTestSetup";

describe("Button tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // create a setup template for the very similar state test cases
  let stateTests: TestSetup;

  // setup before each test
  beforeEach(() => {
    stateTests = setup()
      .perform(t => t
        .addButton("button", x, y)
        .addInteractionPoint("ip", "Touch"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  afterEach(() => {
    stateTests.dispose();
  });

  test("Button Sprite Types should be SpriteType.Button", () => {
    stateTests.feed(t => t.pointMove("ip", x, y)).run();
    expect(stateTests.sprites.button.type).toStrictEqual(SpriteType.Button);
  });

  // tests asserting that all states of the button are achievable

  test("State 'Active_Hover_Selected' is achievable", () => {
    stateTests
      .feed(t => t
        .setSelected("button", true)
        .pointDown("ip", x, y), // activate button
      ).run();
    const button = stateTests.sprites.button as IButton;

    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Active_Hover_Selected");
  });

  test("State 'Inactive_Hover_Selected' is achievable", () => {
    stateTests.feed(t => t
      .setSelected("button", true)
      .pointMove("ip", x, y), // hover over button
    ).run();
    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Inactive_Hover_Selected");
  });

  test("State 'Active_NoHover_Selected' is achievable", () => {
    stateTests.feed(t => t
      .setSelected("button", true)
      .pointDown("ip", x, y) // activate button
      .pointMove("ip", 0, 0), // move away from button to unhover
    ).run();
    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Active_NoHover_Selected");
  });

  test("State 'Inactive_NoHover_Selected' is achievable", () => {
    stateTests
      .feed(t => t
        .setSelected("button", true),
      ).run();
    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(true);
    expect(button.texture).toBe("Inactive_NoHover_Selected");
  });

  test("State 'Active_Hover_Unselected' is achievable", () => {
    stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointDown("ip", x, y),
      ).run();

    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(true);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Active_Hover_Unselected");
  });

  test("State 'Inactive_Hover_Unselected' is achievable", () => {
    stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointMove("ip", x, y),
      ).run();
    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(true);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Inactive_Hover_Unselected");
  });

  test("State 'Active_NoHover_Unselected' is achievable", () => {
    stateTests
      .feed(t => t
        .setSelected("button", false)
        .pointDown("ip", x, y)
        .pointMove("ip", 0, 0),
      ).run();
    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(true);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Active_NoHover_Unselected");
  });

  test("State 'Inactive_NoHover_Unselected' is achievable", () => {
    stateTests
      .feed(t => t
        .setSelected("button", false),
      ).run();
    const button = stateTests.sprites.button as IButton;
    expect(button.active).toBe(false);
    expect(button.hover).toBe(false);
    expect(button.selected).toBe(false);
    expect(button.texture).toBe("Inactive_NoHover_Unselected");
  });

});
