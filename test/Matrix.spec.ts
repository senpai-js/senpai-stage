import * as Matrix from "../src/matrix";
import { IInteractionPoint } from "../src/util";

function matrixCompare(actual: Matrix.CanvasMatrix2D, expected: Matrix.CanvasMatrix2D) {
  expect(actual[0]).toBeCloseTo(expected[0], 14);
  expect(actual[1]).toBeCloseTo(expected[1], 14);
  expect(actual[2]).toBeCloseTo(expected[2], 14);
  expect(actual[3]).toBeCloseTo(expected[3], 14);
  expect(actual[4]).toBeCloseTo(expected[4], 14);
  expect(actual[5]).toBeCloseTo(expected[5], 14);
}

describe("The Matrix namespace", () => {
  const point: IInteractionPoint = {
    active: null,
    captured: false,
    clicked: false,
    down: false,
    firstDown: false,
    hover: null,
    id: "test",
    tx: 0,
    ty: 0,
    type: "Touch",
    x: 100,
    y: 100,
  };

  test("Translate should translate a matrix.", () => {
    const { value } = Matrix.copy(Matrix.Identity).translate(100, 100);
    matrixCompare(value, [1, 0, 0, 1, 100, 100]);
  });

  test("Scale should scale a matrix property.", () => {
    const { value } = Matrix.copy(Matrix.Identity)
      .set([1, 1, 2, 2, 0, 0])
      .scale(2, 3);
    matrixCompare(value, [2, 2, 6, 6, 0, 0]);
  });

  test("Rotate should rotate a matrix.", () => {
    const { value } = Matrix.copy(Matrix.Identity).rotate(Math.PI);
    matrixCompare(value, [-1, 0, 0, -1, 0, 0]);
  });

  test("Should transform points", () => {
    Matrix.copy(Matrix.Identity)
      .scale(2, 3)
      .transformPoint(point);

    expect(point.tx).toBe(200);
    expect(point.ty).toBe(300);
  });

  test("Perform some complicated math.", () => {
    Matrix.copy(Matrix.Identity)
      .rotate(Math.PI / 2)
      .scale(2, 2)
      .transformPoint(point);

    expect(point.ty).toBeCloseTo(200);
    expect(point.tx).toBeCloseTo(-200);
  });
});
