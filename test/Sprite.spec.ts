import { ITestSetupTemplate, setup } from "./setupUtil";

describe("Sprite tests", () => {
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
        .addInteractionPoint("ip", "Touch"))
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

  test("isHovering point returns self", () => {
    const { values } = stateTests
      .feed(t => t.setSize("label", 50, 50)
        .pointMove("ip", x, y),
      )
      .run();
    const { label } = values.sprites;
    const { ip } = values.points;
    expect(label.isHovering(ip, label.lastInterpolated)).toBe(values.sprites.label);
  });

  test("isHovering calls narrowPhase if broadPhase returns true", () => {
    const { values } = stateTests
      .feed(t => t.pointMove("ip", x, y))
      .run();
    const { label } = values.sprites;
    label.broadPhase = jest.fn(t => true);
    label.narrowPhase = jest.fn(t => label);
    label.isHovering(values.points.ip, label.lastInterpolated);
    expect(label.narrowPhase).toBeCalled();
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

  test("skipAnimation returns true if the animation hasn't completed", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6])
      .over(20);
    const isSkipped = label.skipAnimation(Date.now() + 10);
    expect(isSkipped).toBeTruthy();
  });

  test("clearAnimation sets lastInterpolated to now", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    const now = Date.now() + 100;
    label.clearAnimation(now);
    expect(label.lastInterpolated).toBe(now);
  });

  test("expect setTexture to emit event", () => {
    const { values } = stateTests.feed(
      t => t
        .addCheckbox("checkbox", 1, 1)
        .addEventCallback("cb", "textureChangeEvent", "checkbox"),
    ).run();
    const { checkbox } = values.sprites;
    checkbox.setTexture("Active_Hover_Checked");
    expect(values.callbacks.cb).toBeCalled();
  });
});
