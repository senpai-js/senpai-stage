import { IInteractionPoint } from "../util";

export interface IMatrix {
  value: number[] | Float64Array;
  immutable: boolean;
  translate(x: number, y: number): IMatrix;
  scale(x: number, y: number): IMatrix;
  rotate(angle: number): IMatrix;
  skewX(angle: number): IMatrix;
  skewY(angle: number): IMatrix;
  transform(props: Float64Array | number[]): IMatrix;
  inverse(): IMatrix;
  reset(): IMatrix;
  set(target: Float64Array | number[]): IMatrix;
}

export class Matrix implements IMatrix {
  public value: number[] | Float64Array = new Float64Array(Identity);
  public immutable: boolean = false;

  constructor(value?: number[] | Float64Array, immutable?: boolean) {
    this.value = value || new Float64Array(Identity);
    this.immutable = immutable || this.immutable;
  }

  public translate(x: number, y: number): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      translate(x, y, this.value, m.value);
      return m;
    }

    translate(x, y, this.value, this.value);
    return this;
  }

  public scale(x: number, y: number): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      scale(x, y, this.value, m.value);
      return m;
    }

    scale(x, y, this.value, this.value);
    return this;
  }

  public rotate(angle: number): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      rotate(angle, this.value, m.value);
      return m;
    }

    rotate(angle, this.value, this.value);
    return this;
  }

  public skewX(angle: number): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      skewX(angle, this.value, m.value);
      return m;
    }

    skewX(angle, this.value, this.value);
    return this;
  }

  public skewY(angle: number): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      skewY(angle, this.value, m.value);
      return m;
    }

    skewY(angle, this.value, this.value);
    return this;
  }

  public transform(props: Float64Array | number[]): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      transform(this.value, props, m.value);
      return m;
    }
    transform(this.value, props, this.value);
    return this;
  }

  public reset(): IMatrix {
    if (this.immutable) {
      return chain();
    }
    reset(this.value);
    return this;
  }

  public set(target: Float64Array | number[]): IMatrix {
    set(target, this.value);
    return this;
  }

  public inverse(): IMatrix {
    if (this.immutable) {
      const m = new Matrix(this.value, true);
      inverse(this.value, m.value);
      return m;
    }

    inverse(this.value, this.value);
    return this;
  }
}

export function inverse(
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const a: number = matrix[0];
  const b: number = matrix[1];
  const c: number = matrix[2];
  const d: number = matrix[3];
  const e: number = matrix[4];
  const f: number = matrix[5];
  const det: number = 1 / (a * d - c * b);

  setMatrix[0] = d * det;
  setMatrix[1] = -b * det;
  setMatrix[2] = -c * det;
  setMatrix[3] = a * det;
  setMatrix[4] = (c * f - e * d) * det;
  setMatrix[5] = (e * b - a * f) * det;
}

export const Identity = new Float64Array([1, 0, 0, 1, 0, 0]);
export const IdentityMatrix = new Matrix(Identity, true);

export function translate(
  x: number,
  y: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  setMatrix[0] = matrix[0];
  setMatrix[1] = matrix[1];
  setMatrix[2] = matrix[2];
  setMatrix[3] = matrix[3];
  setMatrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
  setMatrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
}

export function scale(
  x: number,
  y: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  setMatrix[0] = matrix[0] * x;
  setMatrix[1] = matrix[1] * x;
  setMatrix[2] = matrix[2] * y;
  setMatrix[3] = matrix[3] * y;
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
}

export function rotate(
  angle: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const a = matrix[0];
  const b = matrix[1];
  const c = matrix[2];
  const d = matrix[3];

  setMatrix[0] = a * cos + c * sin;
  setMatrix[1] = b * cos + d * sin;
  setMatrix[2] = c * cos - a * sin;
  setMatrix[3] = d * cos - b * sin;
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
}

export function skewX(
  angle: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const tan = Math.tan(angle);

  setMatrix[0] = matrix[0];
  setMatrix[1] = matrix[1];
  setMatrix[2] = matrix[2] + matrix[0] * tan;
  setMatrix[3] = matrix[3] + matrix[1] * tan;
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
}

export function skewY(
  angle: number,
  matrix: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  const tan = Math.tan(angle);

  setMatrix[0] = matrix[0] + matrix[2] * tan;
  setMatrix[1] = matrix[1] + matrix[3] * tan;
  setMatrix[2] = matrix[2];
  setMatrix[3] = matrix[3];
  setMatrix[4] = matrix[4];
  setMatrix[5] = matrix[5];
}

export function transform(
  matrix: Float64Array | number[],
  props: Float64Array | number[],
  setMatrix: Float64Array | number[],
): void {
  // props values
  const pa = props[0];
  const pb = props[1];
  const pc = props[2];
  const pd = props[3];
  const pe = props[4];
  const pf = props[5];

  // matrix values
  const ma = matrix[0];
  const mb = matrix[1];
  const mc = matrix[2];
  const md = matrix[3];
  const me = matrix[4];
  const mf = matrix[5];

  setMatrix[0] = ma * pa + mc * pb;
  setMatrix[1] = mb * pa + md * pb;
  setMatrix[2] = ma * pc + mc * pd;
  setMatrix[3] = mb * pc + md * pd;
  setMatrix[4] = ma * pe + mc * pf + me;
  setMatrix[5] = mb * pe + md * pf + mf;
}

export function transformPoints(
  points: IInteractionPoint[],
  matrix: Float64Array | number[],
): void {
  for (const point of points) {
    transformPoint(point, matrix);
  }
}

export function transformPoint(point: IInteractionPoint, matrix: Float64Array | number[]): void {
  point.tx = matrix[0] * point.x + matrix[2] * point.y + matrix[4];
  point.ty = matrix[1] * point.x + matrix[3] * point.y + matrix[5];
}

export function set(target: Float64Array | number[], source: Float64Array | number[]): void {
  for (let i = 0; i < target.length && i < source.length; i++) {
    target[i] = source[i];
  }
}

export function reset(target: Float64Array | number[]): void {
  return set(target, [1, 0, 0, 1, 0, 0]);
}

export function chain(
  value: Float64Array | number[] = Identity,
  immutable: boolean = false,
): IMatrix {
  return new Matrix(value, immutable);
}
