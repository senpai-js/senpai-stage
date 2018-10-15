import { setup, TestSetup } from "./senpaiTestSetup";

describe("InteractionManager Raw Events", () => {
  let tests: TestSetup;
  beforeEach(() => {
    tests = setup();
  });
  afterEach(() => {
    tests.dispose();
  });

  test("mousemove event calls mouseMove", () => {
    tests.mockStagePrototypeFunction("cb", "mouseMove")
      .dispatchMouseEvent("mousemove", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mousemove after stage dispose doesn't call callback", () => {
    tests.mockStagePrototypeFunction("cb", "mouseMove")
      .disposeStage()
      .dispatchMouseEvent("mousemove", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("mousedown event calls mouseMove", () => {
    tests.mockStagePrototypeFunction("cb", "mouseDown")
      .dispatchMouseEvent("mousedown", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mousedown after stage dispose doesn't call callback", () => {
    tests.mockStagePrototypeFunction("cb", "mouseDown")
      .disposeStage()
      .dispatchMouseEvent("mousedown", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("mouseup event calls mouseUp", () => {
    tests.mockStagePrototypeFunction("cb", "mouseUp")
      .dispatchMouseEvent("mouseup", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mouseup after stage dispose doesn't call callback", () => {
    tests.mockStagePrototypeFunction("cb", "mouseUp")
      .disposeStage()
      .dispatchMouseEvent("mouseup", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("mouseup event on window calls mouseUp", () => {
    tests.mockStagePrototypeFunction("cb", "mouseUp")
      .dispatchWindowMouseEvent("mouseup", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mouseup event on window after stage dispose doesn't call callback", () => {
    tests.mockStagePrototypeFunction("cb", "mouseUp")
      .disposeStage()
      .dispatchWindowMouseEvent("mouseup", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("touch start event calls touchStart event", () => {
    tests.mockStagePrototypeFunction("cb", "touchStart")
      .dispatchTouchEvent("touchstart", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("touch start event calls touchStart event", () => {
    tests.mockStagePrototypeFunction("cb", "touchStart")
      .disposeStage()
      .dispatchTouchEvent("touchstart", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("touch move event calls touchMove event", () => {
    tests.dispatchTouchEvent("touchstart", 50, 50)
      .mockStagePrototypeFunction("cb", "touchMove")
      .dispatchTouchEvent("touchmove", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("touch move event calls touchMove event", () => {
    tests.mockStagePrototypeFunction("cb", "touchMove")
      .disposeStage()
      .dispatchTouchEvent("touchmove", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("touch end event calls touchEnd event", () => {
    tests
      .dispatchTouchEvent("touchstart", 50, 50)
      .mockStagePrototypeFunction("cb", "touchEnd")
      .dispatchTouchEvent("touchend", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("touch end event calls touchEnd event", () => {
    tests.mockStagePrototypeFunction("cb", "touchMove")
      .disposeStage()
      .dispatchTouchEvent("touchend", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("touch end event calls touchEnd event", () => {
    tests.mockStagePrototypeFunction("cb", "touchEnd")
      .dispatchWindowTouchEvent("touchend", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("touch end event calls touchEnd event", () => {
    tests.mockStagePrototypeFunction("cb", "touchMove")
      .disposeStage()
      .dispatchWindowTouchEvent("touchend", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("touch cancel event calls touchCancel event", () => {
    tests
      .dispatchTouchEvent("touchstart", 50, 50)
      .mockStagePrototypeFunction("cb", "touchCancel")
      .dispatchTouchEvent("touchcancel", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("touch cancel event calls touchCancel event", () => {
    tests.mockStagePrototypeFunction("cb", "touchCancel")
      .disposeStage()
      .dispatchTouchEvent("touchcancel", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("touch cancel event on window calls touchCancel event", () => {
    tests.mockStagePrototypeFunction("cb", "touchCancel")
      .dispatchWindowTouchEvent("touchcancel", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("touch cancel event on window calls touchCancel event", () => {
    tests.mockStagePrototypeFunction("cb", "touchCancel")
      .disposeStage()
      .dispatchWindowTouchEvent("touchcancel", 50, 50);

    const { callbacks } = tests;
    expect(callbacks.cb).not.toBeCalled();
  });

  test("keydown event on canvas calls keyDown", () => {
    tests.mockStagePrototypeFunction("cb", "keyDown")
      .dispatchKeyEvent("keydown", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keydown event on canvas calls keyDown", () => {
    tests.mockStagePrototypeFunction("cb", "keyDown")
      .disposeStage()
      .dispatchKeyEvent("keydown", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keydown event on window calls keyDown", () => {
    tests.mockStagePrototypeFunction("cb", "keyDown")
      .dispatchWindowKeyEvent("keydown", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keydown event on window calls keyDown", () => {
    tests.mockStagePrototypeFunction("cb", "keyDown")
      .disposeStage()
      .dispatchWindowKeyEvent("keydown", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keyup event on canvas calls keyUp", () => {
    tests.mockStagePrototypeFunction("cb", "keyUp")
      .dispatchKeyEvent("keyup", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keyup event on canvas calls keyUp", () => {
    tests.mockStagePrototypeFunction("cb", "keyUp")
      .disposeStage()
      .dispatchKeyEvent("keyup", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keyup event on window calls keyUp", () => {
    tests.mockStagePrototypeFunction("cb", "keyUp")
      .dispatchWindowKeyEvent("keyup", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keyup event on window calls keyUp", () => {
    tests.mockStagePrototypeFunction("cb", "keyUp")
      .disposeStage()
      .dispatchWindowKeyEvent("keyup", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keypress event on canvas calls keyPress", () => {
    tests.mockStagePrototypeFunction("cb", "keyPress")
      .dispatchKeyEvent("keypress", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keypress event on canvas calls keyPress", () => {
    tests.mockStagePrototypeFunction("cb", "keyPress")
      .disposeStage()
      .dispatchKeyEvent("keypress", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keypress event on window calls keyPress", () => {
    tests.mockStagePrototypeFunction("cb", "keyPress")
      .dispatchWindowKeyEvent("keypress", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("keypress event on window calls keyPress", () => {
    tests.mockStagePrototypeFunction("cb", "keyPress")
      .disposeStage()
      .dispatchWindowKeyEvent("keypress", "a", false, false, false);

    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mousedown event on canvas emits mouseDownEvent", () => {
    tests.addStageEventCallback("cb", "mouseDownEvent")
      .dispatchMouseEvent("mousedown", 50, 50);
    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mouseup event on canvas emits mouseUpEvent", () => {
    tests.addStageEventCallback("cb", "mouseUpEvent")
      .dispatchMouseEvent("mouseup", 50, 50);
    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

  test("mousemove event on canvas emits mouseMoveEvent", () => {
    tests.addStageEventCallback("cb", "mouseMoveEvent")
      .dispatchMouseEvent("mousemove", 50, 50);
    const { callbacks } = tests;
    expect(callbacks.cb).toBeCalled();
  });

});
