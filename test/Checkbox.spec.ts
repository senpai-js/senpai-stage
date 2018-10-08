import { Cursor, SpriteType } from "../src/util";
import { ICheckbox } from "../src/view/Checkbox";
import { ITestSetupTemplate, setup } from "./setupUtil";

describe("Checkbox tests", () => {
  const x = 50;
  const y = 50;

  let stateTests: ITestSetupTemplate;

  // setup before each test
  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t
        .addCheckbox("checkbox", x, y)
        .addInteractionPoint("ip", "Touch"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  // TODO: assert that update() guarantees the cursor to be changed
  test("Button Sprite Types should be SpriteType.Checkbox", () => {
    const { values } = stateTests.feed(t => t.pointMove("ip", x, y)).run();
    expect(values.sprites.checkbox.type).toStrictEqual(SpriteType.Checkbox);
  });

  test("Cursor should change when checkbox is hovered", () => {
    const { values } = stateTests.feed(
      t => t.pointMove("ip", x, y),
    ).run();
    expect(values.stage.canvas.style.cursor).toStrictEqual(Cursor.pointer);
  });

  test("If a checkbox is added to the stage after the point is moved, the collision is still registered", () => {
    const { sprites: {checkbox} } = setup()
      .addInteractionPoint("ip", "Touch")
      .pointMove("ip", x, y)
      .addCheckbox("checkbox", x, y)
      .updateStage()
      .values;

    expect(checkbox.cursor).toBe(Cursor.pointer);
  });

  // tests asserting that all states of the checkbox are achievable

  test("State 'Active_Hover_Checked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
        .pointDown("ip", x, y),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Active_Hover_Checked");
  });

  test("State 'Inactive_Hover_Checked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
        .pointMove("ip", x, y),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;

    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Inactive_Hover_Checked");
  });

  test("State 'Active_NoHover_Checked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", true)
        .pointDown("ip", x, y)
        .pointMove("ip", 0, 0),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Active_NoHover_Checked");
  });

  test("State 'Inactive_NoHover_Checked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", true),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.texture).toBe("Inactive_NoHover_Checked");
  });

  test("State 'Active_Hover_Unchecked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
        .pointDown("ip", x, y),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Active_Hover_Unchecked");
  });

  test("State 'Inactive_Hover_Unchecked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
        .pointMove("ip", x, y),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(true);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Inactive_Hover_Unchecked");
  });

  test("State 'Active_NoHover_Unchecked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", false)
        .pointDown("ip", x, y)
        .pointMove("ip", 0, 0),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(true);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Active_NoHover_Unchecked");
  });

  test("State 'Inactive_NoHover_Unchecked' is achievable", () => {
    const { values } = stateTests
      .feed(t => t
        .setChecked("checkbox", false),
      ).run();

    const checkbox = values.sprites.checkbox as ICheckbox;
    expect(checkbox.active).toBe(false);
    expect(checkbox.hover).toBe(false);
    expect(checkbox.checked).toBe(false);
    expect(checkbox.texture).toBe("Inactive_NoHover_Unchecked");
  });
});
