
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
});
