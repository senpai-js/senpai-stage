
import { ITextInput } from "../src/view/TextInput";
import { ITestSetupTemplate, setup } from "./setupUtil";

describe("TextInput behavior", () => {
  let tests: ITestSetupTemplate;
  const x: number = 50;
  const y: number = 50;

  beforeEach(() => {
    tests = setup().template
      .perform(t => t
        .addInteractionPoint("ip", "Touch")
        .addTextInput("ti", x, y),
      )
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage(),
      );
  });

  test("keydown for single character presses while not selecting adds text input", () => {
    const { values } = tests.feed(t => t
      .focus("ti")
      .keyDown("a")
      .keyDown("🤔")
      .keyDown("u")
      .keyDown("🌋"),
    ).run();
    const ti = values.sprites.ti as ITextInput;
    expect(ti.text).toStrictEqual(["a", "🤔", "u", "🌋"]);
  });

  test("keydown for single character press replaces text input selection", () => {
    const { values } = tests.feed(t => t
      .setLabelText("ti", "testing")
      .focus("ti")
      .textInputSelectRange("ti", 2, 4)
      .keyDown("🌋"),
    ).run();
    const ti = values.sprites.ti as ITextInput;
    expect(ti.text).toStrictEqual(["t", "e", "🌋", "i", "n", "g"]);
  });

  test("keydown for backspace on caret", () => {
    const { values } = tests.feed(t => {
      t.setLabelText("ti", "testing")
      .focus("ti");
      (t.values.sprites.ti as ITextInput).caretIndex = 2;
      return t.keyDown("Backspace");
    }).run();
    const ti = values.sprites.ti as ITextInput;
    expect(ti.text).toStrictEqual(["t", "s", "t", "i", "n", "g"]);
  });

  test("keydown for backspace on selection", () => {
    const { values } = tests.feed(t => t
      .setLabelText("ti", "testing")
      .focus("ti")
      .textInputSelectRange("ti", 2, 4)
      .keyDown("Backspace"),
    ).run();
    const ti = values.sprites.ti as ITextInput;
    expect(ti.text).toStrictEqual(["t", "e", "i", "n", "g"]);
  });

  test("keydown for insertMode replaces characters", () => {
    const { values } = tests.feed(t => {
      t
        .setLabelText("ti", "testing")
        .focus("ti");
      (t.values.sprites.ti as ITextInput).caretIndex = 3;
      return t.keyDown("Insert")
        .keyDown("a")
        .keyDown("b")
        .keyDown("c");
    }).run();

    const ti = values.sprites.ti as ITextInput;
    expect(ti.text).toStrictEqual("tesabcg".split(""));
  });

  test("when caret advances beyond view it modifies textScroll", () => {
    const { values } = tests.feed(t => {
      t.setLabelText("ti", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
      (t.values.sprites.ti as ITextInput).caretIndex = 50;
      return t;
    }).run();
    const ti = values.sprites.ti as ITextInput;
    expect(ti.textScroll).not.toBe(0);
  });

  test("stage update 30x causes caret to toggle visibility", () => {
    const { values } = tests.feed(t => t).run();
    const ti = values.sprites.ti as ITextInput;
    const currentState = ti.showCaret;
    for (let i = 0; i < 30; i++) {
      values.stage.update();
    }
    expect(ti.showCaret).not.toBe(currentState);
  });

  test("clicking on the text input moves the caret", () => {
    const text = "abcdefghij";
    const { values } = tests.feed(t => t.setLabelText("ti", text)).run();
    const ti = values.sprites.ti as ITextInput;
    const targetText = "abcd";
    const { stage } = values;
    const { ip } = values.points;
    stage.ctx.font = `${ti.fontSize}px ${ti.font}`;
    const targetX = stage.ctx.measureText(targetText).width;

    ti.height = 60;
    ti.width = targetX + 50;
    const target = {
      clientX: x + targetX + ti.padding.left,
      clientY: y + ti.padding.top + 1,
    } as MouseEvent | Touch;
    stage.pointDown(ip, target);
    stage.pointUp(ip, target);
    expect(ti.focused).toBeTruthy();
    expect(ti.caretIndex).toBe(4);
  });
});
