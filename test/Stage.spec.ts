import { Cursor } from "../src/util";
import { setup, TestSetup } from "./senpaiTestSetup";

describe("Button tests", () => {
  // location of button
  const x = 50;
  const y = 50;

  // create a setup template for the very similar state test cases
  let stateTests: TestSetup;

  // setup before each test
  beforeEach(() => {
    stateTests = setup()
      .perform(t => t
        .addButton("button", x, y)
        .addInteractionPoint("ip", "Touch"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });
  afterEach(() => {
    stateTests.dispose();
  });

  test("PreInterpolate event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "preInterpolateEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PreInterpolate");
  });

  test("PostInterpolate event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "postInterpolateEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PostInterpolate");
  });

  test("PreHoverCheck event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "preHoverCheckEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PreHoverCheck");
  });

  test("PostHoverCheck event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "postHoverCheckEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PostHoverCheck");
  });

  test("PreUpdate event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "preUpdateEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PreUpdate");
  });

  test("PostUpdate event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "postUpdateEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PostUpdate");
  });

  test("PreRender event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "preRenderEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PreRender");
  });

  test("PostRender event fires successfully", () => {
    const {
      stage,
      sprites,
      points,
      callbacks,
    } = stateTests.feed(t => t.addStageEventCallback("cb", "postRenderEvent")).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PostRender");
  });

  test("Events fire in correct order, regardless of order attached", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => t
      .addStageEventCallback("cb", "postUpdateEvent")
      .addStageEventCallback("cb", "preRenderEvent")
      .addStageEventCallback("cb", "preInterpolateEvent")
      .addStageEventCallback("cb", "postHoverCheckEvent")
      .addStageEventCallback("cb", "preUpdateEvent")
      .addStageEventCallback("cb", "postInterpolateEvent")
      .addStageEventCallback("cb", "preHoverCheckEvent")
      .addStageEventCallback("cb", "postRenderEvent"),
    ).run();
    expect(callbacks.cb).toBeCalled();
    expect(callbacks.cb.mock.calls[0][0].eventType).toBe("PreInterpolate");
    expect(callbacks.cb.mock.calls[1][0].eventType).toBe("PostInterpolate");
    expect(callbacks.cb.mock.calls[2][0].eventType).toBe("PreHoverCheck");
    expect(callbacks.cb.mock.calls[3][0].eventType).toBe("PostHoverCheck");
    expect(callbacks.cb.mock.calls[4][0].eventType).toBe("PreUpdate");
    expect(callbacks.cb.mock.calls[5][0].eventType).toBe("PostUpdate");
    expect(callbacks.cb.mock.calls[6][0].eventType).toBe("PreRender");
    expect(callbacks.cb.mock.calls[7][0].eventType).toBe("PostRender");
  });

  test("stage update should call interpolate every update", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => {
      t.sprites.button.interpolate = jest.fn();
      return t;
    }).run();
    expect(sprites.button.interpolate).toBeCalled();
  });

  test("stage update should call isHovering every update if there is a point", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => {
      t.sprites.button.isHovering = jest.fn();
      return t;
    }).run();
    expect(sprites.button.isHovering).toBeCalled();
  });

  test("stage update should call pointCollision every update if isHovering returns sprite", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => {
      const button = t.sprites.button;
      t.sprites.button.isHovering = jest.fn(e => button);
      t.sprites.button.pointCollision = jest.fn(e => true);
      return t;
    }).run();
    expect(sprites.button.isHovering).toBeCalled();
    expect(sprites.button.pointCollision).toBeCalled();
  });

  test("stage skipAnimation should call skipAnimation on sprite", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => {
      t.sprites.button.skipAnimation = jest.fn(e => true);
      return t;
    }).run();
    stage.skipAnimations();
    expect(sprites.button.skipAnimation).toBeCalled();
  });

  test("stage render should call render on sprite", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => {
      t.sprites.button.render = jest.fn();
      return t;
    }).run();
    expect(sprites.button.render).toBeCalled();
  });

  test("stage render should modify the cursor property", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => {
      const button = t.sprites.button;
      t.sprites.button.isHovering = jest.fn(e => button);
      t.sprites.button.pointCollision = jest.fn(e => true);
      return t;
    }).run();
    expect(stage.canvas.style.cursor).toBe(Cursor.pointer);
  });

  test("If a button is added to the stage after the point is moved, the collision is still registered", () => {
    const { stage } = setup()
      .addInteractionPoint("ip", "Touch")
      .pointMove("ip", x, y)
      .addCloseButton("button", x, y)
      .updateStage()
      .renderStage()
      .dispose();

    expect(stage.canvas.style.cursor).toStrictEqual(Cursor.pointer);
  });
});
