import { awayDown, awayUp, common, hoverDown, hoverUp, noop, pointMoveOrderCommon } from "./commonSetup";
import { TestSetup } from "./senpaiTestSetup";

describe("Sprite pointMoveEvent emitter", () => {
  let testSetup: TestSetup;
  beforeEach(() => {
    testSetup = common();
  });
  afterEach(() => {
    testSetup.dispose();
  });

  test("point that never hovers or moves", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that simply hovers over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down then goes up away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that goes up over sprite after going down away from it", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down and stays away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that goes down away from sprite and moves over it while down", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that hovers over sprite, then moves away", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  // NOTE: pointMove event fired because the point starts outside of the label
  // and moves inside it. This is verified by the 6 following tests.
  test("point that hovers over sprite, then doesn't move", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that moves before label added under it and then moves", () => {
    const test = pointMoveOrderCommon();
    const { callbacks } = test.feed(t => t
        .addInteractionPoint("ip", "Touch")
        .pointMove("ip", 50, 50)
        .addLabel("sprite", 50, 50)).feed(noop).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
    test.dispose();
  });

  test("point that doesn't move before label added under it and then moves", () => {
    const test = pointMoveOrderCommon();
    const { callbacks } = test.feed(t => t
        .addInteractionPoint("ip", "Touch")
        .addLabel("sprite", 0, 0)).feed(noop).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
    test.dispose();
  });

  test("point that is added on top of label and then moves", () => {
    const test = pointMoveOrderCommon();
    const { callbacks } = test.feed(t => t
        .addLabel("sprite", 0, 0)
        .addInteractionPoint("ip", "Touch")).feed(noop).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
    test.dispose();
  });

  test("point that moves before label added under it and then doesn't move", () => {
    const test = pointMoveOrderCommon();
    const { callbacks } = test.feed(t => t
        .addInteractionPoint("ip", "Touch")
        .pointMove("ip", 50, 50)
        .addLabel("sprite", 50, 50)).feed(noop).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
    test.dispose();
  });

  test("point that doesn't move before label added under it and then doesn't move", () => {
    const test = pointMoveOrderCommon();
    const { callbacks } = test.feed(t => t
        .addInteractionPoint("ip", "Touch")
        .addLabel("sprite", 0, 0)).feed(noop).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
    test.dispose();
  });

  test("point that is added on top of label and then doesn't move", () => {
    const test = pointMoveOrderCommon();
    const { callbacks } = test.feed(t => t
        .addLabel("sprite", 0, 0)
        .addInteractionPoint("ip", "Touch")).feed(noop).run();
    expect(callbacks.pointMoveEvent).not.toBeCalled();
    test.dispose();
  });

  test("point that hovers over sprite, then goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that hovers over sprite, then goes down", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down over sprite, then goes up away from it", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down over sprite, then goes up", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down over sprite, then moves away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(callbacks.pointMoveEvent).toBeCalled();
  });
});
