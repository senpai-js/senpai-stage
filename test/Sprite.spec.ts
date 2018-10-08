import { easeInCub, easeInOutSin, easeLinear } from "../src/ease";
import { Cursor, KeyFrameEntryType, SpriteType } from "../src/util";
import { ITestSetupTemplate, setup } from "./setupUtil";

describe("Sprite tests", () => {
  // location of button
  const x = 50;
  const y = 50;
  const testPosition = {
    s: 2,
    x: 200,
    y: 250,
  };
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

  test("pointMove event should fire with correct values", () => {
    const { values } = stateTests
      .feed(t => t.addEventCallback("cb", "pointMoveEvent", "label")
        .setSize("label", 50, 50)
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

  test("move function should set 'from' property of keyFrame to interpolatedPosition if it's the first keyFrame",
    () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.interpolatedPosition = [1, 2, 3, 4, 5, 6];
    label.move([1, 0, 0, 1, 0, 0]);
    expect(label.keyFrames[0].from).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test("wait creates new IKeyFrameEntry", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(label.keyFrames).toHaveLength(0);
    label.wait(10);
    expect(label.keyFrames).toHaveLength(1);
  });

  test("wait sets start to previous keyFrame end or now", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.wait(10).wait(20);
    expect(label.keyFrames[1].start).toBe(label.keyFrames[0].end);
  });

  test("wait sets the end to start + wait", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.wait(10).wait(20);
    expect(label.keyFrames[0].end).toBe(label.keyFrames[0].start + 10);
  });

  test("wait sets type to KeyFrameEntryType.Wait", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.wait(10);
    expect(label.keyFrames[0].type).toBe(KeyFrameEntryType.Wait);
  });

  test("move creates new keyFrame", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;

    expect(label.keyFrames).toHaveLength(0);
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames).toHaveLength(1);
  });

  test("movePosition creates new keyFrame", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;

    expect(label.keyFrames).toHaveLength(0);
    label.movePosition(testPosition);
    expect(label.keyFrames).toHaveLength(1);
  });

  test("move sets start to previous keyFrame end or now", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.wait(10).move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames[1].start).toBe(label.keyFrames[0].end);
  });

  test("movePosition sets start to previous keyFrame end or now", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.wait(10).movePosition(testPosition);
    expect(label.keyFrames[1].start).toBe(label.keyFrames[0].end);
  });

  test("move sets the end to start", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames[0].end).toBe(label.keyFrames[0].start);
  });

  test("movePosition sets the end to start", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.movePosition(testPosition);
    expect(label.keyFrames[0].end).toBe(label.keyFrames[0].start);
  });

  test("move sets type to KeyFrameEntryType.Move", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames[0].type).toBe(KeyFrameEntryType.Move);
  });

  test("movePosition sets type to KeyFrameEntryType.Move", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.movePosition(testPosition);
    expect(label.keyFrames[0].type).toBe(KeyFrameEntryType.Move);
  });

  test("move sets ease to eases.linear", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames[0].ease).toBe(easeLinear);
  });

  test("move sets ease to eases.linear", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.movePosition(testPosition);
    expect(label.keyFrames[0].ease).toBe(easeLinear);
  });

  test("move sets 'to' to provided matrix", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames[0].to).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test("movePosition calculates 'to' property", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.movePosition(testPosition);
    expect(label.keyFrames[0].to).toStrictEqual([2, 0, 0, 2, 200, 250]);
  });

  test("repeat creates new keyFrameEntry", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(label.keyFrames).toHaveLength(0);
    label.repeat();
    expect(label.keyFrames).toHaveLength(1);
  });

  test("repeat sets type to KeyFrameEntryType.Repeat", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.repeat();
    expect(label.keyFrames[0].type).toBe(KeyFrameEntryType.Repeat);
  });

  test("skipAnimation returns true if the animation hasn't completed", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6])
      .over(20);
    const isSkipped = label.skipAnimation(Date.now() + 10);
    expect(isSkipped).toBeTruthy();
  });

  test("skipAnimation returns false if the animation is repeating", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6])
      .over(200)
      .move([6, 5, 4, 3, 2, 1])
      .over(400)
      .repeat();
    const isSkipped = label.skipAnimation(Date.now() + 10);
    expect(isSkipped).toBeFalsy();
  });

  test("over should throw if there are no keyframes to modify", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(() => label.over(9000)).toThrow();
  });

  test("with should throw if there are no keyframes to modify", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(() => label.with(easeInOutSin)).toThrow();
  });

  test("over sets currentKeyframe end to start + animationLength", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.movePosition(testPosition).over(9000);
    expect(label.keyFrames[0].end).toBe(label.keyFrames[0].start + 9000);
  });

  test("with sets current keyFrame ease to provided ease", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.movePosition(testPosition).with(easeInOutSin);
    expect(label.keyFrames[0].ease).toBe(easeInOutSin);
  });

  test("clearAnimation sets lastInterpolated to now", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    const now = Date.now() + 100;
    label.clearAnimation(now);
    expect(label.lastInterpolated).toBe(now);
  });

  test("clearAnimation sets lastInterpolated to now", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames).not.toHaveLength(0);
    const now = Date.now() + 100;
    label.clearAnimation(now);
    expect(label.keyFrames).toHaveLength(0);
  });

  test("sprite interpolate should move the sprite", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 1, 2, 2, 3, 3])
      .over(10)
      .wait(10)
      .interpolate(Date.now() + 15);
    expect(label.interpolatedPosition).toStrictEqual([1, 1, 2, 2, 3, 3]);
  });

  test("sprite interpolate should move the sprite", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 1, 2, 2, 50, 50])
      .over(10)
      .interpolate(label.keyFrames[0].start + 5);
    expect(label.interpolatedPosition).toStrictEqual([1, 0.5, 1, 1.5, 50, 50]);
  });

  test("visible sets the alpha of the current keyFrame", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    label.move([1, 2, 3, 4, 5, 6]);
    expect(label.keyFrames[0].alpha).toBe(1);
    label.visible(0.5);
    expect(label.keyFrames[0].alpha).toBe(0.5);
  });

  test("cannot move sprite after repeat", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label.repeat().move([1, 2, 3, 4, 5, 6])).toThrow();
  });

  test("cannot movePosition sprite after repeat", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label.repeat().movePosition({ x: 100, y: 200 })).toThrow();
  });

  test("cannot change animation timespan of repeat", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label.repeat().over(9000)).toThrow();
  });

  test("cannot set ease function of repeat", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label.repeat().with(easeInCub)).toThrow();
  });

  test("over function throws for non finite numbers", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label
      .movePosition({ x: 100, y: 100 })
      .over(Infinity),
    ).toThrow();
  });

  test("over function throws for NaN", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label
      .movePosition({ x: 100, y: 100 })
      .over(NaN),
    ).toThrow();
  });

  test("over function throws for negative numbers", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label
      .movePosition({ x: 100, y: 100 })
      .over(-1),
    ).toThrow();
  });

  test("over function throws for negative numbers", () => {
    const { values } = stateTests.feed(t => t).run();
    const { label } = values.sprites;
    expect(e => label
      .movePosition({ x: 100, y: 100 })
      .over(-1),
    ).toThrow();
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
