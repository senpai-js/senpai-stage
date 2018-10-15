import { Cursor, SpriteType } from "../src/util";
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
        .addPanel("panel", x, y)
        .addButton("button", x, y)
        .addSpriteToPanel("button", "panel")
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

  test("Panel Sprite Types should be SpriteType.Panel", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => t).run();
    expect(sprites.panel.type).toStrictEqual(SpriteType.Panel);
  });

  test("Button parent should be panel.", () => {
    const { stage, sprites, points, callbacks } = stateTests.feed(t => t).run();
    expect(sprites.button.parent).toBe(sprites.panel);
  });

  test("Hover over nested button should update cursor.", () => {
    const { stage, sprites, points, callbacks } = stateTests
      .feed(t => t.pointMove("ip", 104, 104))
      .run();

    expect(stage.canvas.style.cursor).toBe(Cursor.pointer);
  });

  test("Hover over nested button should cause isHovering to return button.", () => {
    const { stage, sprites, points, callbacks } = stateTests
      .feed(t => t.pointMove("ip", 104, 104))
      .run();
    const { panel, button } = sprites;
    const { ip } = points;
    expect(panel.isHovering(ip, Date.now()).id).toBe(button.id);
  });
});
