
import { setup, TestSetup } from "./senpaiTestSetup";

describe("InteractionManager virtual events", () => {
  let tests: TestSetup;
  const x = 50;
  const y = 50;
  beforeEach(() => {
    tests = setup();
  });
  afterEach(() => {
    tests.dispose();
  });

  test("touchstart emits touchStartEvent", () => {
    const { callbacks } = tests.addStageEventCallback("cb", "touchStartEvent")
      .dispatchTouchEvent("touchstart", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchmove emits touchMoveEvent", () => {
    const { callbacks } = tests.addStageEventCallback("cb", "touchMoveEvent")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchmove", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchend emits touchEndEvent", () => {
    const { callbacks } = tests.addStageEventCallback("cb", "touchEndEvent")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchend", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchcancel emits touchCancelEvent", () => {
    const { callbacks } = tests.addStageEventCallback("cb", "touchCancelEvent")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchcancel", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchstart calls addTouchPoint", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "addTouchPoint")
      .dispatchTouchEvent("touchstart", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchstart calls pointMove", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "pointMove")
      .dispatchTouchEvent("touchstart", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchstart calls pointDown", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "pointDown")
      .dispatchTouchEvent("touchstart", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchend calls removeTouchPoint", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "removeTouchPoint")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchend", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchend calls pointUp", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "pointUp")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchend", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchcancel calls pointCancel", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "pointCancel")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchcancel", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchcancel calls removeTouchPoint", () => {
    const { callbacks } = tests.mockStagePrototypeFunction("cb", "removeTouchPoint")
      .dispatchTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchcancel", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchmove calls pointMove", () => {
    const { callbacks } = tests.dispatchTouchEvent("touchstart", x, y)
      .mockStagePrototypeFunction("cb", "pointMove")
      .dispatchTouchEvent("touchmove", x, y);

    expect(callbacks.cb).toBeCalled();
  });

  test("touchmove from offscreen onto canvas does not throw", () => {
    expect(
      () => tests.dispatchWindowTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchmove", x, y),
    ).not.toThrow();
  });

  test("touchcancel from offscreen onto canvas does not throw", () => {
    expect(
      () => tests.dispatchWindowTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchcancel", x, y),
    ).not.toThrow();
  });

  test("touchend from offscreen onto canvas does not throw", () => {
    expect(
      () => tests.dispatchWindowTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchend", x, y),
    ).not.toThrow();
  });

  test("touchmove after touchstart outside of canvas adds point to stage", () => {
    const { stage } = tests;
    expect(stage.points).toHaveLength(1);
    tests.dispatchWindowTouchEvent("touchstart", x, y);
    expect(stage.points).toHaveLength(1);
    tests.dispatchTouchEvent("touchmove", x, y);
    expect(stage.points).toHaveLength(2);
  });

  test("touchmove after touchstart outside of canvas sets point.down to true", () => {
    const { stage } = tests
      .dispatchWindowTouchEvent("touchstart", x, y)
      .dispatchTouchEvent("touchmove", x, y);
    expect(stage.points[1].down).toBeTruthy();
  });
});
