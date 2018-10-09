import { awayDown, awayUp, common, hoverDown, hoverUp } from "./commonSetup";
import { ITestSetup, ITestSetupTemplate } from "./setupUtil";

describe("Sprite pointMoveEvent emitter", () => {
  let testSetup: ITestSetupTemplate;
  beforeEach(() => {
    testSetup = common();
  });

  test("point that never hovers or moves", () => {
    const { values } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(values.callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that simply hovers over sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down away from sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(values.callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that goes down over sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down then goes up away from sprite", () => {
    const { values } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(values.callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that goes up over sprite after going down away from it", () => {
    const { values } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down and stays away from sprite", () => {
    const { values } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(values.callbacks.pointMoveEvent).not.toBeCalled();
  });

  test("point that goes down away from sprite and moves over it while down", () => {
    const { values } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that hovers over sprite, then moves away", () => {
    const { values } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  // NOTE: Whether the move event is called because the point starts outside of
  // the sprite or just because of an implementation quirk is unclear.
  //
  // Scenarios:
  // - ip created, ip moved, label added underneath ip
  // - label created at point where ip will be created, ip created and doesn't
  //   move
  // - ip created, ip not moved, label added underneath ip
  //
  // If this is not an implementation quirk, I predict that in all these cases,
  // pointMoveEvent should not be called.
  test("point that hovers over sprite, then doesn't move", () => {
    const { values } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that hovers over sprite, then goes down away from sprite", () => {
    const { values } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  // see previous comment
  test("point that hovers over sprite, then goes down", () => {
    const { values } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down over sprite, then goes up away from it", () => {
    const { values } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  // see previous comment
  test("point that goes down over sprite, then goes up", () => {
    const { values } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  test("point that goes down over sprite, then moves away from sprite", () => {
    const { values } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });

  // see previous comment
  test("point that goes down over sprite", () => {
    const { values } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(values.callbacks.pointMoveEvent).toBeCalled();
  });
});
