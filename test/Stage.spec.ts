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
        .addButton("button", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  test("PreInterpolate event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "preInterpolateEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PreInterpolate");
  });

  test("PostInterpolate event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "postInterpolateEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PostInterpolate");
  });

  test("PreHoverCheck event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "preHoverCheckEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PreHoverCheck");
  });

  test("PostHoverCheck event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "postHoverCheckEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PostHoverCheck");
  });

  test("PreUpdate event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "preUpdateEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PreUpdate");
  });

  test("PostUpdate event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "postUpdateEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PostUpdate");
  });

  test("PreRender event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "preRenderEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PreRender");
  });

  test("PostRender event fires successfully", () => {
    const { values } = stateTests.feed(t => t.addStageEventCallback("cb", "postRenderEvent")).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PostRender");
  });
});
