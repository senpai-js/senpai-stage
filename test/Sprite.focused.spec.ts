import { awayDown, awayUp, common, hoverDown, hoverUp } from "./commonSetup";
import { ITestSetup, ITestSetupTemplate } from "./setupUtil";

describe("Sprite focused property", () => {
  let testSetup: ITestSetupTemplate;
  beforeEach(() => {
    testSetup = common();
  });

  test("point that never hovers or moves", () => {
    const { values } = testSetup.feed(awayUp).feed(awayUp).run();
    expect(values.sprites.sprite.focused).toBeFalsy();
  });

  test("point that simply hovers over sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(hoverUp).run();
    expect(values.sprites.sprite.focused).toBeFalsy();
  });

  test("point that goes down away from sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(values.sprites.sprite.focused).toBeFalsy();
  });

  test("point that goes down over sprite", () => {
    const { values } = testSetup.feed(awayUp).feed(awayDown).run();
    expect(values.sprites.sprite.focused).toBeTruthy();
  });
});
