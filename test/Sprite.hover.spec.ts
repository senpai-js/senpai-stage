import { awayDown, awayUp, common, hoverDown, hoverUp } from "./commonSetup";
import { ITestSetup, ITestSetupTemplate } from "./setupUtil";

describe("Sprite focused property", () => {
  let testSetup: ITestSetupTemplate;
  beforeEach(() => {
    testSetup = common();
  });

  test("point that never hovers or moves", () => {
    const { values } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that simply hovers over sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that goes down away from sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that goes down over sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(hoverDown).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that goes down then goes up away from sprite", () => {
    const { values } = testSetup.feed(awayDown).feed(awayUp).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that goes up over sprite after going down", () => {
    const { values } = testSetup.feed(awayDown).feed(hoverUp).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that goes down and stays away from sprite", () => {
    const { values } = testSetup.feed(awayDown).feed(awayDown).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that goes down over sprite and simply hovers over it", () => {
    const { values } = testSetup.feed(awayDown).feed(hoverDown).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that hovers over sprite, then moves away", () => {
    const { values } = testSetup.feed(hoverUp).feed(awayUp).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that hovers over sprite, then doesn't move", () => {
    const { values } = testSetup.feed(hoverUp).feed(hoverUp).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that hovers over sprite, then goes down away from sprite", () => {
    const { values } = testSetup.feed(hoverUp).feed(awayDown).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that hovers over sprite, then goes down", () => {
    const { values } = testSetup.feed(hoverUp).feed(hoverDown).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that goes down over sprite, then moves away", () => {
    const { values } = testSetup.feed(hoverDown).feed(awayUp).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that goes down over sprite, then goes up", () => {
    const { values } = testSetup.feed(hoverDown).feed(hoverUp).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });

  test("point that goes down over sprite, then moves away from sprite", () => {
    const { values } = testSetup.feed(hoverDown).feed(awayDown).run();
    expect(values.sprites.sprite.hover).toBeFalsy();
  });

  test("point that goes down over sprite", () => {
    const { values } = testSetup.feed(hoverDown).feed(hoverDown).run();
    expect(values.sprites.sprite.hover).toBeTruthy();
  });
});
