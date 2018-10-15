import { use } from "../src/matrix";
import { setup, TestSetup } from "./senpaiTestSetup";

describe("Sprite tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // create a setup template for the very similar state test cases
  let stateTests: TestSetup;

  // setup before each test
  beforeEach(() => {
    stateTests = setup()
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
    const { sprites, points, callbacks } = stateTests.feed(t => t).run();
    expect(sprites.label.id).toBe("label");
  });

  test("isHovering point returns self", () => {
    const { sprites, points, callbacks } = stateTests
      .feed(t => t.setSize("label", 50, 50)
        .pointMove("ip", x, y),
      )
      .run();
    const { label } = sprites;
    const { ip } = points;
    expect(label.isHovering(ip, label.lastInterpolated)).toBe(sprites.label);
  });

  test("isHovering calls narrowPhase if broadPhase returns true", () => {
    const { sprites, points, callbacks } = stateTests
      .feed(t => t.pointMove("ip", x, y))
      .run();
    const { label } = sprites;
    label.broadPhase = jest.fn(t => true);
    label.narrowPhase = jest.fn(t => label);
    label.isHovering(points.ip, label.lastInterpolated);
    expect(label.narrowPhase).toBeCalled();
  });

  test("keyDown event should fire on focused sprite.", () => {
    const { sprites, points, callbacks } = stateTests
      .feed(t => t.focus("label")
        .addEventCallback("cb", "keyDownEvent", "label")
        .keyDown("a"),
    ).run();
    const { cb } = callbacks;
    expect(cb).toBeCalled();
    expect(cb.mock.calls[0][0].key).toBe("a");
  });

  test("keyDown event should not fire on unfocused sprite.", () => {
    const { sprites, points, callbacks } = stateTests
      .feed(t => t.addEventCallback("cb", "keyDownEvent", "label")
        .keyDown("a"),
    ).run();
    const { cb } = callbacks;
    const { label } = sprites;
    expect(label.focused).toBeFalsy();
    expect(cb).not.toBeCalled();
  });

  test("skipAnimation returns true if the animation hasn't completed", () => {
    const { sprites, points, callbacks } = stateTests.feed(t => t).run();
    const { label } = sprites;
    label.move([1, 2, 3, 4, 5, 6])
      .over(20);
    const isSkipped = label.skipAnimation(Date.now() + 10);
    expect(isSkipped).toBeTruthy();
  });

  test("clearAnimation sets lastInterpolated to now", () => {
    const { sprites, points, callbacks } = stateTests.feed(t => t).run();
    const { label } = sprites;
    const now = Date.now() + 100;
    label.clearAnimation(now);
    expect(label.lastInterpolated).toBe(now);
  });

  test("expect setTexture to emit event", () => {
    const { sprites, points, callbacks } = stateTests.feed(
      t => t.addCheckbox("checkbox", 1, 1)
        .addEventCallback("cb", "textureChangeEvent", "checkbox"),
    ).run();
    const { checkbox } = sprites;
    checkbox.setTexture("Active_Hover_Checked");
    expect(callbacks.cb).toBeCalled();
  });

  test("expect sprite container to be stage", () => {
    const { sprites, stage } = stateTests.feed(t => t).run();
    expect(sprites.label.container).toBe(stage);
  });

  test("expect sprite to set z position", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    label.setZ(10);
    expect(label.z).toBe(10);
  });

  test("expect sprite setZ to throw with bad Values", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    expect(() => label.setZ(NaN)).toThrow();
    expect(() => label.setZ(Infinity)).toThrow();
    expect(() => label.setZ(-Infinity)).toThrow();
    expect(() => label.setZ(null)).toThrow();
    expect(() => label.setZ("10" as any)).toThrow();
  });

  test("expect sprite interpolatedPosition to be modified", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    use(label.interpolatedPosition).set([1, 1, 1, 1, 1, 1]);
    label.move([2, 2, 2, 2, 2, 2]).over(100);
    label.interpolate(label.keyFrames[0].start + 50);
    expect(label.interpolatedPosition[0]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[1]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[2]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[3]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[4]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[5]).toBeCloseTo(1.5);
  });

  test("repeated calls to interpolated before the last interpolated time do not move the sprite", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    use(label.interpolatedPosition).set([1, 1, 1, 1, 1, 1]);
    label.move([2, 2, 2, 2, 2, 2]).over(100);
    const animateTo = label.keyFrames[0].start + 50;
    label.interpolate(animateTo);
    label.interpolate(animateTo - 10);
    expect(label.interpolatedPosition[0]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[1]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[2]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[3]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[4]).toBeCloseTo(1.5);
    expect(label.interpolatedPosition[5]).toBeCloseTo(1.5);
  });

  test("expect visible to animate alpha", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    label.visible(0).over(100);
    label.interpolate(label.keyFrames[0].start + 50);
    expect(label.interpolatedAlpha).toBeCloseTo(0.5);
  });

  test("expect interpolated inverse to be calculated", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    use(label.interpolatedPosition).set([1, 0, 0, 1, 0, 0]);
    label.move([2, 0, 0, 2, 100, 100]).over(100);
    label.interpolate(label.keyFrames[0].start + 100);
    expect(label.inverse[0]).toBeCloseTo(0.5);
    expect(label.inverse[1]).toBeCloseTo(0);
    expect(label.inverse[2]).toBeCloseTo(0);
    expect(label.inverse[3]).toBeCloseTo(0.5);
    expect(label.inverse[4]).toBeCloseTo(-50);
    expect(label.inverse[5]).toBeCloseTo(-50);
  });

  test("expect lastInterpolated to be cached", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;
    label.move([2, 0, 0, 2, 100, 100]).over(100);
    const animatedTo = label.keyFrames[0].start + 100;
    label.interpolate(animatedTo);
    expect(label.lastInterpolated).toBe(animatedTo);
  });

  test("expect narrowPhase to return self", () => {
    const { sprites } = stateTests.feed(t => t).run();
    const { label } = sprites;

    // no logic is performed for narrowphase in generic sprites
    expect(label.narrowPhase(null)).toBe(label);
  });

  test("expect setTexture to throw if texture does not exist", () => {
    const { sprites } = stateTests.feed(t => t.addButton("button", x, y)).run();
    const { button } = sprites;
    expect(() => button.setTexture("Dummy_Texture")).toThrow();
  });

  test("expect setTexture to throw if texture does not exist", () => {
    const { sprites } = stateTests.feed(t => t.addButton("button", x, y)).run();
    const { button } = sprites;
    expect(() => button.setTexture("Dummy_Texture")).toThrow();
  });

  test("expect setTexture to set the texture property", () => {
    const texture = "Inactive_Hover_Selected";
    const { sprites } = stateTests.feed(t => t.addButton("button", x, y)).run();
    const { button } = sprites;
    button.setTexture(texture);
    expect(button.texture).toBe(texture);
  });
});
