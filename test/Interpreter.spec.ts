import { AudioContext } from "web-audio-test-api";
import {
  end,
  IInterpreter,
  IInterpreterResult,
  Interpreter,
  InterpreterResultType,
  IScriptMap,
  jump,
} from "../src/interpreter";
import { ISpriteSheetJSON } from "../src/spritesheet";

describe("Interpreters", () => {
  let i: IInterpreter;

  function createScriptMap(id: string): IScriptMap {
    return { [id]: async (interpreter: IInterpreter) => jump(id) };
  }

  beforeEach(() => {
    i = new Interpreter({
      audioContext: new AudioContext(),
      canvas: document.createElement("canvas"),
      height: 600,
      width: 800,
    });
  });
  afterEach(() => {
    i.dispose();
  });

  test("setFlag sets a flag", () => {
    i.setFlag("test", 1);
    expect(i.flags.test).toBe(1);
  });

  test("getFlag gets a flag", () => {
    i.setFlag("test", 1);
    expect(i.getFlag("test")).toBe(1);
  });

  test("setFlag does not override previous values", () => {
    i.setFlag("test", 1);
    expect(() => i.setFlag("test", 2)).toThrow();
    expect(i.flags.test).toBe(1);
  });

  test("getFlag should throw if flag does not exist", () => {
    expect(() => i.getFlag("test")).toThrow();
  });

  test("setData sets a data key", () => {
    i.setData("test", 1);
    expect(i.data.test).toBe(1);
  });

  test("getData gets a data key", () => {
    i.setData("test", 1);
    expect(i.getData("test")).toBe(1);
  });

  test("getData should throw if key does not exist", () => {
    expect(() => i.getData("test")).toThrow();
  });

  test("setPersist sets a data key", () => {
    i.setPersist("test", 1);
    expect(i.persist.test).toBe(1);
  });

  test("getPersist gets a data key", () => {
    i.setPersist("test", 1);
    expect(i.getPersist("test")).toBe(1);
  });

  test("getPersist should throw if key does not exist", () => {
    expect(() => i.getPersist("test")).toThrow();
  });

  test("setScripts should accept script functions", () => {
    async function scriptFunc(): Promise<IInterpreterResult> {
      return jump("end");
    }

    i.setScripts({ scriptFunc });
    expect(i.scripts.scriptFunc).toBe(scriptFunc);
  });

  test("setScripts should accept multiple script maps", () => {
    i.setScripts(...["one", "two", "three"].map(createScriptMap));

    expect(i.scripts.one).toBeTruthy();
    expect(i.scripts.two).toBeTruthy();
    expect(i.scripts.three).toBeTruthy();
  });

  test("getScript should get a script", () => {
    const map = createScriptMap("one");
    i.setScripts(map);
    expect(i.getScript("one")).toBe(map.one);
  });

  test("getScript throws if script does not exist", () => {
    expect(() => i.getScript("test")).toThrow();
  });

  test("expect end to return InterpreterResultType.End", () => {
    expect(end().type).toBe(InterpreterResultType.End);
  });

  test("expect jump to return InterpreterResultType.Jump", () => {
    expect(jump("test").type).toBe(InterpreterResultType.Jump);
  });

  test("expect jump to return script value", () => {
    expect(jump("test").script).toBe("test");
  });

  test("expect characters map to contain predefined sprites", () => {
    i.loadCharacter(
      "aya",
      "Aya Shameimaru",
      "Yellow",
      Promise.resolve([] as ISpriteSheetJSON),
      Promise.resolve(new Image()) as any,
    );
    const { aya } = i.characters;
    expect(aya).toBeTruthy();
  });
});
