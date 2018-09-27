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
        .addLabel("label", x, y)
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  test("id should be set to label", () => {
    const { values } = stateTests.feed(t => t).run();
    expect(values.sprites.label.id).toBe("label");
  });

});
