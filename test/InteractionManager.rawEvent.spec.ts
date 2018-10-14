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
});
