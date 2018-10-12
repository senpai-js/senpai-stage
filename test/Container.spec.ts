import { setup, TestSetup } from "./senpaiTestSetup";

describe("Containers", () => {
  let template: TestSetup;
  const x = 50;
  const y = 50;

  beforeEach(() => {
    template = setup()
      .perform(
        t => t.addLabel("label", x, y)
          .addInteractionPoint("ip", "Touch"),
          // .addPlayable("p"),
      )
      .placeholder()
      .perform(
        t => t.updateStage()
          .renderStage(),
      );
  });

  test("sprites should be added to the stage", () => {
    const { stage, sprites, points } = template.feed(t => t).run();
    expect(stage.sprites).toContain(sprites.label);
  });

  test("sprites should be removed from the stage", () => {
    const { stage, sprites, points } = template.feed(t => t).run();
    expect(stage.sprites).toContain(sprites.label);
    stage.removeSprite(sprites.label);
    expect(stage.sprites).not.toContain(sprites.label);
  });

  test("getSpriteByID should return a sprite", () => {
    const { stage, sprites, points } = template.feed(t => t).run();
    expect(stage.getSpriteByID("label")).toBe(sprites.label);
  });

  test("points should be added to the stage", () => {
    const { stage, sprites, points } = template.feed(t => t).run();
    expect(stage.points).toContain(points.ip);
  });

  test("points should be removed from the stage", () => {
    const { stage, sprites, points } = template.feed(t => t).run();
    expect(stage.points).toContain(points.ip);
    stage.removePoint(points.ip);
    expect(stage.points).not.toContain(points.ip);
  });

  test("getPointByID should return a point", () => {
    const { stage, sprites, points } = template.feed(t => t).run();
    expect(stage.getPointByID("ip")).toBe(points.ip);
  });

});
