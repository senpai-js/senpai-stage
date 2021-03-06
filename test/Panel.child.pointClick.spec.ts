import { awayDown, awayUp, common, hoverDown, hoverUp } from "./commonSetupPanel";
import { TestSetup } from "./senpaiTestSetup";

describe("Sprite pointClickEvent emitter", () => {
  let testSetup: TestSetup;
  beforeEach(() => {
    testSetup = common();
  });
  afterEach(() => {
    testSetup.dispose();
  });

  test("point with sprite on panel that never hovers or moves", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that simply hovers over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down then goes up away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes up over sprite after going down away from it", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down and stays away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down away from sprite and moves over it while down", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then moves away", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then doesn't move", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then goes down", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite, then moves away", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite, then goes up", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(callbacks.pointClickEvent).toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite, then moves away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(callbacks.pointClickEvent).not.toBeCalled();
  });

  // point click function

  test("point with sprite on panel that never hovers or moves", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that simply hovers over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down then goes up away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes up over sprite after going down away from it", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down and stays away from sprite", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down away from sprite and moves over it while down", () => {
    const { callbacks } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then moves away", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then doesn't move", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then goes down away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that hovers over sprite, then goes down", () => {
    const { callbacks } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite, then moves away", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite, then goes up", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(callbacks.pointClick).toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite, then moves away from sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });

  test("point with sprite on panel that goes down over sprite", () => {
    const { callbacks } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(callbacks.pointClick).not.toBeCalled();
  });
});
