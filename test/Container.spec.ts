import { ITestSetupTemplate, setup } from "./setupUtil";

describe("Containers", () => {
  let template: ITestSetupTemplate;
  const x = 50;
  const y = 50;

  beforeEach(() => {
    template = setup()
      .template.perform(
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
    const { values } = template.feed(t => t).run();
    expect(values.stage.sprites).toContain(values.sprites.label);
  });

  test("sprites should be removed from the stage", () => {
    const { values } = template.feed(t => t).run();
    expect(values.stage.sprites).toContain(values.sprites.label);
    values.stage.removeSprite(values.sprites.label);
    expect(values.stage.sprites).not.toContain(values.sprites.label);
  });

  test("getSpriteByID should return a sprite", () => {
    const { values } = template.feed(t => t).run();
    expect(values.stage.getSpriteByID("label")).toBe(values.sprites.label);
  });

  test("points should be added to the stage", () => {
    const { values } = template.feed(t => t).run();
    expect(values.stage.points).toContain(values.points.ip);
  });

  test("points should be removed from the stage", () => {
    const { values } = template.feed(t => t).run();
    expect(values.stage.points).toContain(values.points.ip);
    values.stage.removePoint(values.points.ip);
    expect(values.stage.points).not.toContain(values.points.ip);
  });

  test("getPointByID should return a point", () => {
    const { values } = template.feed(t => t).run();
    expect(values.stage.getPointByID("ip")).toBe(values.points.ip);
  });

});
