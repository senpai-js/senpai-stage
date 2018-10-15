import { awayDown, awayUp, common, hoverDown, hoverUp } from "./commonSetupPanel";
import { TestSetup } from "./senpaiTestSetup";

describe("Sprite active property", () => {
  let testSetup: TestSetup;
  beforeEach(() => {
    testSetup = common();
  });
  afterEach(() => {
    testSetup.dispose();
  });

  test("point with sprite on panel that never hovers or moves", () => {
    const { sprites } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that simply hovers over sprite", () => {
    const { sprites } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes down away from sprite", () => {
    const { sprites } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes down over sprite", () => {
    const { sprites } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(sprites.sprite.active).toBeTruthy();
  });

  test("point with sprite on panel that goes down then goes up away from sprite", () => {
    const { sprites } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes up over sprite after going down", () => {
    const { sprites } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes down and stays away from sprite", () => {
    const { sprites } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes down away from sprite and hovers over it while staying down", () => {
    const { sprites } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that hovers over sprite, then moves away", () => {
    const { sprites } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that hovers over sprite, then doesn't move", () => {
    const { sprites } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that hovers over sprite, then goes down away from sprite", () => {
    const { sprites } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that hovers over sprite, then goes down", () => {
    const { sprites } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(sprites.sprite.active).toBeTruthy();
  });

  test("point with sprite on panel that goes down over sprite, then goes up away from it", () => {
    const { sprites } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes down over sprite, then goes up", () => {
    const { sprites } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(sprites.sprite.active).toBeFalsy();
  });

  test("point with sprite on panel that goes down over sprite, then moves away from sprite", () => {
    const { sprites } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(sprites.sprite.active).toBeTruthy();
  });

  test("point with sprite on panel that goes down over sprite", () => {
    const { sprites } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(sprites.sprite.active).toBeTruthy();
  });
});
