/****
 * Custom ease functions, designed with functional programming concepts.
 */
import { PI, TAU } from "./consts";

export type EaseFunc = (ratio: number) => number;

function inverse(inFunc: EaseFunc): EaseFunc {
  return function outFunc(ratio: number): number {
    return 1 - inFunc(1 - ratio);
  };
}

function inOut(inFunc: EaseFunc): EaseFunc {
  const outFunc = inverse(inFunc);
  return (ratio: number): number => ratio < 0.5
    ? 0.5 * inFunc(ratio * 2)
    : 0.5 + 0.5 * outFunc(2 * ratio - 1);
}

export const easeLinear: EaseFunc = function linear(ratio: number): number {
  return ratio;
};

export const easeInQuad: EaseFunc = (ratio: number): number => ratio * ratio;
export const easeOutQuad: EaseFunc = inverse(easeInQuad);
export const easeInOutQuad: EaseFunc = inOut(easeInQuad);

export const easeInCub: EaseFunc =
  (ratio: number): number => ratio * ratio * ratio;
export const easeOutCub: EaseFunc = inverse(easeInCub);
export const easeInOutCub: EaseFunc = inOut(easeInCub);

export const easeInQuart: EaseFunc =
  (ratio: number): number => ratio * ratio * ratio * ratio;
export const easeOutQuart: EaseFunc = inverse(easeInQuart);
export const easeInOutQuart: EaseFunc = inOut(easeInQuart);

export const easeInQuint: EaseFunc =
  (ratio: number): number => ratio * ratio * ratio * ratio * ratio;
export const easeOutQuint: EaseFunc = inverse(easeInQuint);
export const easeInOutQuint: EaseFunc = inOut(easeInQuint);

export const easeOutSin: EaseFunc =
  (ratio: number): number => Math.sin(ratio * PI * 0.5);
export const easeInSin: EaseFunc = inverse(easeOutSin);
export const easeInOutSin: EaseFunc = inOut(easeInSin);

const p = 0.3;
export const easeOutElastic: EaseFunc =
  (ratio: number): number => Math.pow(2, -10 * ratio) * Math.sin((ratio - p / 4) * TAU / p) + 1;
export const easeInElastic: EaseFunc = inverse(easeOutElastic);
export const easeInOutElastic: EaseFunc = inOut(easeInElastic);
