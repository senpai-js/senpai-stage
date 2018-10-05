import * as easeFunc from "../src/ease";

const funcNames = [
  "easeLinear",

  "easeInQuad",
  "easeOutQuad",
  "easeInOutQuad",

  "easeInCub",
  "easeOutCub",
  "easeInOutCub",

  "easeInQuart",
  "easeOutQuart",
  "easeInOutQuart",

  "easeInQuint",
  "easeOutQuint",
  "easeInOutQuint",

  "easeOutSin",
  "easeInSin",
  "easeInOutSin",

  "easeOutElastic",
  "easeInElastic",
  "easeInOutElastic",
];

describe("Ease function tests", () => {

  for (const funcName of funcNames) {
    test(`${funcName} function should return 0 when input is 0`, () => {
      const result = easeFunc[funcName](0);
      expect(result).toBeCloseTo(0);
    });

    test(`${funcName} function should return 1 when input is 1`, () => {
      const result = easeFunc[funcName](1);
      expect(result).toBeCloseTo(1);
    });
  }
});
