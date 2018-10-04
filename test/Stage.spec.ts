import { Cursor } from "../src/util";
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

  test("Events fire in correct order, regardless of order attached", () => {
    const { values } = stateTests.feed(t => t
      .addStageEventCallback("cb", "postUpdateEvent")
      .addStageEventCallback("cb", "preRenderEvent")
      .addStageEventCallback("cb", "preInterpolateEvent")
      .addStageEventCallback("cb", "postHoverCheckEvent")
      .addStageEventCallback("cb", "preUpdateEvent")
      .addStageEventCallback("cb", "postInterpolateEvent")
      .addStageEventCallback("cb", "preHoverCheckEvent")
      .addStageEventCallback("cb", "postRenderEvent"),
    ).run();
    expect(values.callbacks.cb).toBeCalled();
    expect(values.callbacks.cb.mock.calls[0][0].eventType).toBe("PreInterpolate");
    expect(values.callbacks.cb.mock.calls[1][0].eventType).toBe("PostInterpolate");
    expect(values.callbacks.cb.mock.calls[2][0].eventType).toBe("PreHoverCheck");
    expect(values.callbacks.cb.mock.calls[3][0].eventType).toBe("PostHoverCheck");
    expect(values.callbacks.cb.mock.calls[4][0].eventType).toBe("PreUpdate");
    expect(values.callbacks.cb.mock.calls[5][0].eventType).toBe("PostUpdate");
    expect(values.callbacks.cb.mock.calls[6][0].eventType).toBe("PreRender");
    expect(values.callbacks.cb.mock.calls[7][0].eventType).toBe("PostRender");
  });

  test("stage update should call interpolate every update", () => {
    const { values } = stateTests.feed(t => {
      t.values.sprites.button.interpolate = jest.fn();
      return t;
    }).run();
    expect(values.sprites.button.interpolate).toBeCalled();
  });

  test("stage update should call isHovering every update if there is a point", () => {
    const { values } = stateTests.feed(t => {
      t.values.sprites.button.isHovering = jest.fn();
      return t;
    }).run();
    expect(values.sprites.button.isHovering).toBeCalled();
  });

  test("stage update should call pointCollision every update if isHovering returns sprite", () => {
    const { values } = stateTests.feed(t => {
      const button = t.values.sprites.button;
      t.values.sprites.button.isHovering = jest.fn(e => button);
      t.values.sprites.button.pointCollision = jest.fn(e => true);
      return t;
    }).run();
    expect(values.sprites.button.isHovering).toBeCalled();
    expect(values.sprites.button.pointCollision).toBeCalled();
  });

  test("stage skipAnimation should call skipAnimation on sprite", () => {
    const { values } = stateTests.feed(t => {
      t.values.sprites.button.skipAnimation = jest.fn(e => true);
      return t;
    }).run();
    values.stage.skipAnimations();
    expect(values.sprites.button.skipAnimation).toBeCalled();
  });

  test("stage render should call render on sprite", () => {
    const { values } = stateTests.feed(t => {
      t.values.sprites.button.render = jest.fn();
      return t;
    }).run();
    expect(values.sprites.button.render).toBeCalled();
  });

  test("stage render should modify the cursor property", () => {
    const { values } = stateTests.feed(t => {
      const button = t.values.sprites.button;
      t.values.sprites.button.isHovering = jest.fn(e => button);
      t.values.sprites.button.pointCollision = jest.fn(e => true);
      return t;
    }).run();
    expect(values.stage.canvas.style.cursor).toBe(Cursor.pointer);
  });
});
