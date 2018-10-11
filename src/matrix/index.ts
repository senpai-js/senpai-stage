import { IInteractionPoint } from "../util";
import { ISprite } from "../view/Sprite";
import { IStage, Stage } from "../view/Stage";

export type CanvasMatrix2D = [number, number, number, number, number, number];

export class CanvasMatrix2DTransformAPI {
  public value: CanvasMatrix2D = null;
  constructor(input: CanvasMatrix2D) {
    this.value = input;
  }

  public translate(x: number, y: number): this {
    this.value[4] += this.value[0] * x + this.value[2] * y;
    this.value[5] += this.value[1] * x + this.value[3] * y;
    return this;
  }

  public scale(x: number, y: number): this {
    this.value[0] *= x;
    this.value[1] *= x;
    this.value[2] *= y;
    this.value[3] *= y;
    return this;
  }

  public rotate(radians: number) {
    const cos: number = Math.cos(radians);
    const sin: number = Math.sin(radians);
    const a: number = this.value[0];
    const b: number = this.value[1];
    const c: number = this.value[2];
    const d: number = this.value[3];

    this.value[0] = a * cos + c * sin;
    this.value[1] = b * cos + d * sin;
    this.value[2] = c * cos - a * sin;
    this.value[3] = d * cos - b * sin;

    return this;
  }

  public skewX(radians: number): this {
    const tan = Math.tan(radians);
    this.value[2] += this.value[0] * tan;
    this.value[3] += this.value[1] * tan;
    return this;
  }

  public skewY(radians: number): this {
    const tan = Math.tan(radians);
    this.value[0] += this.value[2] * tan;
    this.value[1] += this.value[3] * tan;
    return this;
  }

  public inverse(): this {
    const a: number = this.value[0];
    const b: number = this.value[1];
    const c: number = this.value[2];
    const d: number = this.value[3];
    const e: number = this.value[4];
    const f: number = this.value[5];
    const det: number = 1 / (a * d - c * b);

    this.value[0] = d * det;
    this.value[1] = -b * det;
    this.value[2] = -c * det;
    this.value[3] = a * det;
    this.value[4] = (c * f - e * d) * det;
    this.value[5] = (e * b - a * f) * det;
    return this;
  }

  public transform(props: CanvasMatrix2D): this {
    // props values
    const pa: number = props[0];
    const pb: number = props[1];
    const pc: number = props[2];
    const pd: number = props[3];
    const pe: number = props[4];
    const pf: number = props[5];

    // matrix values
    const ma: number = this.value[0];
    const mb: number = this.value[1];
    const mc: number = this.value[2];
    const md: number = this.value[3];
    const me: number = this.value[4];
    const mf: number = this.value[5];

    this.value[0] = ma * pa + mc * pb;
    this.value[1] = mb * pa + md * pb;
    this.value[2] = ma * pc + mc * pd;
    this.value[3] = mb * pc + md * pd;
    this.value[4] = ma * pe + mc * pf + me;
    this.value[5] = mb * pe + md * pf + mf;
    return this;
  }

  public reset(): this {
    this.value[0] = 1;
    this.value[1] = 0;
    this.value[2] = 0;
    this.value[3] = 1;
    this.value[4] = 0;
    this.value[5] = 0;
    return this;
  }

  public set(props: CanvasMatrix2D): this {
    this.value[0] = props[0];
    this.value[1] = props[1];
    this.value[2] = props[2];
    this.value[3] = props[3];
    this.value[4] = props[4];
    this.value[5] = props[5];
    return this;
  }

  public setTo(target: CanvasMatrix2D): this {
    target[0] = this.value[0];
    target[1] = this.value[1];
    target[2] = this.value[2];
    target[3] = this.value[3];
    target[4] = this.value[4];
    target[5] = this.value[5];
    return this;
  }

  public transformPoint(point: IInteractionPoint): this {
    transformPoint(point, this.value);
    return this;
  }
}

export const Identity: CanvasMatrix2D = [1, 0, 0, 1, 0, 0];

export function copy(input: CanvasMatrix2D): CanvasMatrix2DTransformAPI {
  return use([
    input[0],
    input[1],
    input[2],
    input[3],
    input[4],
    input[5],
  ]);
}

export function use(input: CanvasMatrix2D): CanvasMatrix2DTransformAPI {
  return new CanvasMatrix2DTransformAPI(input);
}

export function transformPoint(point: IInteractionPoint, matrix: CanvasMatrix2D): void {
  point.tx = matrix[0] * point.x + matrix[2] * point.y + matrix[4];
  point.ty = matrix[1] * point.x + matrix[3] * point.y + matrix[5];
}

const radFactor: number = Math.PI / 180;
export function rads(degrees: number): number {
  const normalized = normalize(degrees, 360);
  return normalized * radFactor;
}

const degFactor: number = 1 / radFactor;
const PI_2: number = Math.PI * 2;
export function degs(radians: number): number {
  return normalize(radians, PI_2) * degFactor;
}

function normalize(input: number, factor: number): number {
  return ((input % factor) + factor) % factor;
}

export enum StagePosition {
  BottomCenter,
  BottomCenterLeft,
  BottomCenterRight,
  BottomLeft,
  BottomRight,
  CenterLeft,
  Center,
  CenterRight,
  Left,
  Right,
  TopCenter,
  TopCenterLeft,
  TopCenterRight,
  TopLeft,
  TopRight,
}

export function align(sprite: ISprite, position: StagePosition) {
  if (!sprite.container) {
    throw new Error("Sprite cannot be aligned because it was not added to a stage.");
  }

  const stage: IStage = sprite.container as any;

  let widthFactor = 0;
  switch (position) {
    case StagePosition.BottomCenterLeft:
    case StagePosition.CenterLeft:
    case StagePosition.TopCenterLeft:
      widthFactor = 0.25;
      break;
    case StagePosition.BottomCenter:
    case StagePosition.Center:
    case StagePosition.TopCenter:
      widthFactor = 0.5;
      break;
    case StagePosition.BottomCenterRight:
    case StagePosition.CenterRight:
    case StagePosition.TopCenterRight:
      widthFactor = 0.75;
      break;
    case StagePosition.BottomRight:
    case StagePosition.Right:
    case StagePosition.TopRight:
      widthFactor = 1;
      break;
  }

  let heightFactor = 0;
  switch (position) {
    case StagePosition.Center:
    case StagePosition.CenterLeft:
    case StagePosition.CenterRight:
    case StagePosition.Left:
    case StagePosition.Right:
      heightFactor = 0.5;
      break;
    case StagePosition.BottomCenter:
    case StagePosition.BottomCenterLeft:
    case StagePosition.BottomCenterRight:
    case StagePosition.BottomLeft:
    case StagePosition.BottomRight:
      heightFactor = 1;
      break;
  }

  return copy(Identity)
    .translate(stage.canvas.width * widthFactor, stage.canvas.height * heightFactor)
    .translate(-sprite.width * widthFactor, -sprite.height * heightFactor);
}
