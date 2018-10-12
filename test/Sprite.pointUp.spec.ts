import { awayDown, awayUp, common, hoverDown, hoverUp, noop, pointMoveOrderCommon } from "./commonSetup";
import { TestSetup } from "./senpaiTestSetup";

describe("Sprite pointUpEvent emitter", () => {
  let testSetup: TestSetup;
  beforeEach(() => {
    testSetup = common();
  });
  afterEach(() => {
    testSetup.dispose();
  });

  test("point that never hovers or moves", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that simply hovers over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down then goes up away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes up over sprite after going down away from it", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down and stays away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down away from sprite and moves over it while down", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that hovers over sprite, then moves away", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that hovers over sprite, then doesn't move", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that hovers over sprite, then goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that hovers over sprite, then goes down", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down over sprite, then goes up away from it", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(callbacks.pointUpEvent).toBeCalled();
  });

  test("point that goes down over sprite, then goes up", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(callbacks.pointUpEvent).toBeCalled();
  });

  test("point that goes down over sprite, then moves away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });

  test("point that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(callbacks.pointUpEvent).not.toBeCalled();
  });
});
