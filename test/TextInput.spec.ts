
import { Cursor } from "../src/util";
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

  test("keyPress for single character presses while not selecting adds text input", () => {
    const { values } = tests.feed(t => t
      .focus("ti")
      .keyPress("a")
      .keyPress("🤔")
      .keyPress("u")
      .keyPress("🌋"),
    ).run();
    const ti = values.sprites.ti as ITextInput;
    expect(ti.text).toStrictEqual(["a", "🤔", "u", "🌋"]);
  });

  test("keyPress for single character press replaces text input selection", () => {
    const { values } = tests.feed(t => t
      .setLabelText("ti", "testing")
      .focus("ti")
      .textInputSelectRange("ti", 2, 4)
      .keyPress("🌋"),
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

  test("keyPress for insertMode replaces characters", () => {
    const { values } = tests.feed(t => {
      t.setLabelText("ti", "testing")
        .focus("ti");
      (t.values.sprites.ti as ITextInput).caretIndex = 3;
      return t.keyDown("Insert")
        .keyPress("a")
        .keyPress("b")
        .keyPress("c");
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

  test("dragging on the text in the right direction on input causes selection", () => {
    const text = "abcdefghij";
    const { values } = tests.feed(t => t.setLabelText("ti", text)).run();
    const ti = values.sprites.ti as ITextInput;
    const targetText1 = "ab";
    const targetText2 = "abcdef";
    const { stage } = values;
    const { ip } = values.points;
    stage.ctx.font = `${ti.fontSize}px ${ti.font}`;
    const targetX1 = stage.ctx.measureText(targetText1).width;
    const targetX2 = stage.ctx.measureText(targetText2).width;

    ti.height = 60;
    ti.width = Math.max(targetX1, targetX2) + 50;
    const target1 = {
      clientX: x + targetX1 + ti.padding.left,
      clientY: y + ti.padding.top + 1,
    } as MouseEvent | Touch;
    const target2 = {
      clientX: x + targetX2 + ti.padding.left,
      clientY: y + ti.padding.top + 1,
    } as MouseEvent | Touch;
    stage.pointDown(ip, target1);
    stage.pointUp(ip, target2);
    expect(ti.focused).toBeTruthy();
    expect(ti.caretIndex).toBe(2);
    expect(ti.selectionStart).toBe(2);
    expect(ti.selectionEnd).toBe(6);
  });

  test("dragging on the text input in right direction causes selection", () => {
    const text = "abcdefghij";
    const { values } = tests.feed(t => t.setLabelText("ti", text)).run();
    const ti = values.sprites.ti as ITextInput;
    const targetText1 = "abcdef";
    const targetText2 = "ab";
    const { stage } = values;
    const { ip } = values.points;
    stage.ctx.font = `${ti.fontSize}px ${ti.font}`;
    const targetX1 = stage.ctx.measureText(targetText1).width;
    const targetX2 = stage.ctx.measureText(targetText2).width;

    ti.height = 60;
    ti.width = Math.max(targetX1, targetX2) + 50;
    const target1 = {
      clientX: x + targetX1 + ti.padding.left,
      clientY: y + ti.padding.top + 1,
    } as MouseEvent | Touch;
    const target2 = {
      clientX: x + targetX2 + ti.padding.left,
      clientY: y + ti.padding.top + 1,
    } as MouseEvent | Touch;
    stage.pointDown(ip, target1);
    stage.pointUp(ip, target2);
    expect(ti.focused).toBeTruthy();
    expect(ti.caretIndex).toBe(6);
    expect(ti.selectionStart).toBe(2);
    expect(ti.selectionEnd).toBe(6);
  });

  test("mouseDown over textInput sets cursor to text", () => {
    const { values } = tests.feed(t => t
      .setSize("ti", 50, 50)
      .pointDown("ip", x + 10, y + 10),
    ).run();
    expect(values.stage.canvas.style.cursor).toBe(Cursor.text);
  });
});
