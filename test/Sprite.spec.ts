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
        .addLabel("label", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  test("id should be set to label", () => {
    const { values } = stateTests.feed(t => t).run();
    expect(values.sprites.label.id).toBe("label");
  });

  /**
   * pointUpEvent fires with correct point values
   * pointDownEvent fires with correct point values
   * pointClickEvent fires with correct point values
   * pointMoveEvent fires with correct point values
   */

  test("pointDown event should fire.", () => {
    const { values } = stateTests
      .feed(t => t
        .addEventCallback("cb", "pointDownEvent", "label")
        .pointDown("ip", x, y))
      .run();

    const { cb } = values.callbacks;
    expect(cb).toBeCalled();
  });

  test("pointUp event should fire.", () => {
    const { values } = stateTests
      .feed(t => t
        .addEventCallback("cb", "pointUpEvent", "label")
        .pointDown("ip", x, y)
        .pointUp("ip", x, y),
      )
      .run();

    const { cb } = values.callbacks;
    expect(cb).toBeCalled();
  });

  test("pointClick event should fire.", () => {
    const { values } = stateTests
      .feed(t => t
        .addEventCallback("cb", "pointClickEvent", "label")
        .pointDown("ip", x, y)
        .pointUp("ip", x, y),
      )
      .run();

    const { cb } = values.callbacks;
    expect(cb).toBeCalled();
  });

  test("pointClick event should not fire if pointUp happens away from sprite.", () => {
    const { values } = stateTests
      .feed(t => t
        .addEventCallback("cb", "pointClickEvent", "label")
        .pointDown("ip", x, y),
      )
      .run();

    const { cb } = values.callbacks;
    expect(cb).not.toBeCalled();
  });

  test("pointMove event should fire with correct values", () => {
    const { values } = stateTests
      .feed(t => t.addEventCallback("cb", "pointMoveEvent", "label")
        .setSize("label", 50, 50)
        .pointMove("ip", x, y)
        .pointMove("ip", x + 10, y + 10),
      )
      .run();

    expect(values.callbacks.cb.mock.calls[0][0].x).toBe(x);
    expect(values.callbacks.cb.mock.calls[0][0].y).toBe(y);
    expect(values.callbacks.cb.mock.calls[1][0].x).toBe(x + 10);
    expect(values.callbacks.cb.mock.calls[1][0].x).toBe(y + 10);
  });

  test("pointDown event should set sprite active property to true", () => {
    const { values } = stateTests
      .feed(t => t
        .setSize("label", 50, 50)
        .pointDown("ip", x + 10, y + 10),
      )
      .run();

    const { label } = values.sprites;
    expect(label.active).toBeTruthy();
  });

  test("pointDown event should not set sprite active property to true if it goes down away from the sprite", () => {
    const { values } = stateTests
      .feed(t => t
        .pointDown("ip", x - 10, y - 10),
      )
      .run();

    const { label } = values.sprites;
    expect(label.active).not.toBeTruthy();
  });

  test("pointDown event should set sprite focused property to true", () => {
    const { values } = stateTests
    .feed(t => t
      .setSize("label", 50, 50)
      .pointDown("ip", x + 10, y + 10),
      )
      .run();

    const { label } = values.sprites;
    expect(label.focused).toBeTruthy();
    expect(label.isFocused()).toBe(label);
  });

  test("pointDown event should not set sprite focused property to true if it goes down away from the sprite", () => {
    const { values } = stateTests
      .feed(t => t
        .pointDown("ip", x - 10, y - 10),
      )
      .run();

    const { label } = values.sprites;
    expect(label.focused).not.toBeTruthy();
    expect(label.isFocused()).not.toBeTruthy();
  });

  test("keyDown event should fire on focused sprite.", () => {
    const { values } = stateTests
      .feed(t => t.focus("label")
        .addEventCallback("cb", "keyDownEvent", "label")
        .keyDown("a"),
    ).run();
    const { cb } = values.callbacks;
    expect(cb).toBeCalled();
    expect(cb.mock.calls[0][0].key).toBe("a");
  });

  test("keyDown event should not fire on unfocused sprite.", () => {
    const { values } = stateTests
      .feed(t => t.addEventCallback("cb", "keyDownEvent", "label")
        .keyDown("a"),
    ).run();
    const { cb } = values.callbacks;
    const { label } = values.sprites;
    expect(label.focused).toBeFalsy();
    expect(cb).not.toBeCalled();
  });
});
