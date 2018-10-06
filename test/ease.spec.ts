import * as easeFunc from "../src/ease";

const funcs = Object.keys(easeFunc)
  .map((funcName) => [funcName, easeFunc[funcName]]);

describe("Ease function tests", () => {

  for (const [funcName, ease] of funcs) {
    test(`${funcName} function should return 0 when input is 0`, () => {
      const result = ease(0);
      expect(result).toBeCloseTo(0);
    });

    test(`${funcName} function should return 1 when input is 1`, () => {
      const result = ease(1);
      expect(result).toBeCloseTo(1);
    });
  }
});
