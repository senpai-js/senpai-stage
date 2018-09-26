import { Cursor, SpriteType } from "../src/util";
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
        .addPanel("panel", x, y)
        .addButton("button", x, y)
        .addSpriteToPanel("button", "panel")
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  test("Panel Sprite Types should be SpriteType.Panel", () => {
    const { values } = stateTests.feed(t => t).run();
    expect(values.sprites.panel.type).toStrictEqual(SpriteType.Panel);
  });

  test("Button parent should be panel.", () => {
    const { values } = stateTests.feed(t => t).run();
    expect(values.sprites.button.parent).toBe(values.sprites.panel);
  });

  test("Hover over nested button should update cursor.", () => {
    const { values } = stateTests
      .feed(t => t.movePoint("ip", 100, 100))
      .run();

    expect(values.stage.canvas.style.cursor).toBe(Cursor.pointer);
  });

  test("Hover over nested button should cause narrowPhase to return button.", () => {
    const { values } = stateTests
      .feed(t => t.movePoint("ip", 100, 100))
      .run();
    const { panel, button } = values.sprites;
    const { ip } = values.points;
    expect(panel.narrowPhase(ip)).toBe(button);
  });
});
