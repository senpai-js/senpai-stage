/****
 * Custom ease functions, designed with functional programming concepts.
 */
import { PI, TAU } from "./consts";

function inverse(inFunc: (ratio: number) => number): (ratio: number) => number {
  return function outFunc(ratio: number): number {
    return 1 - inFunc(1 - ratio);
  };
}

function inOut(inFunc: (ratio: number) => number): (ratio: number) => number {
  const outFunc = inverse(inFunc);
  return (ratio: number): number => ratio < 0.5
    ? 0.5 * inFunc(ratio * 2)
    : 0.5 + 0.5 * outFunc(2 * ratio - 1);
}

export const easeLinear: (ratio: number) => number = function linear(ratio: number): number {
  return ratio;
};

export const easeInQuad: (ratio: number) => number = (ratio: number): number => ratio * ratio;
export const easeOutQuad: (ratio: number) => number = inverse(easeInQuad);
export const easeInOutQuad: (ratio: number) => number = inOut(easeInQuad);

export const easeInCub: (ratio: number) => number =
  (ratio: number): number => ratio * ratio * ratio;
export const easeOutCub: (ratio: number) => number = inverse(easeInCub);
export const easeInOutCub: (ratio: number) => number = inOut(easeInCub);

export const easeInQuart: (ratio: number) => number =
  (ratio: number): number => ratio * ratio * ratio * ratio;
export const easeOutQuart: (ratio: number) => number = inverse(easeInQuart);
export const easeInOutQuart: (ratio: number) => number = inOut(easeInQuart);

export const easeInQuint: (ratio: number) => number =
  (ratio: number): number => ratio * ratio * ratio * ratio * ratio;
export const easeOutQuint: (ratio: number) => number = inverse(easeInQuint);
export const easeInOutQuint: (ratio: number) => number = inOut(easeInQuint);

export const easeOutSin: (ratio: number) => number =
  (ratio: number): number => Math.sin(ratio * PI * 0.5);
export const easeInSin: (ratio: number) => number = inverse(easeOutSin);
export const easeInOutSin: (ratio: number) => number = inOut(easeInSin);

const p = 0.3;
export const easeOutElastic: (ratio: number) => number =
  (ratio: number): number => Math.pow(2, -10 * ratio) * Math.sin((ratio - p / 4) * TAU / p) + 1;
export const easeInElastic: (ratio: number) => number = inverse(easeOutElastic);
export const easeInOutElastic: (ratio: number) => number = inOut(easeInElastic);
