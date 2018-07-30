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
export declare class Matrix implements IMatrix {
    value: number[] | Float64Array;
    immutable: boolean;
    constructor(value?: number[] | Float64Array, immutable?: boolean);
    translate(x: number, y: number): IMatrix;
    scale(x: number, y: number): IMatrix;
    rotate(angle: number): IMatrix;
    skewX(angle: number): IMatrix;
    skewY(angle: number): IMatrix;
    transform(props: Float64Array | number[]): IMatrix;
    reset(): IMatrix;
    set(target: Float64Array | number[]): IMatrix;
    inverse(): IMatrix;
}
export declare function inverse(matrix: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare const Identity: Float64Array;
export declare const IdentityMatrix: Matrix;
export declare function translate(x: number, y: number, matrix: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare function scale(x: number, y: number, matrix: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare function rotate(angle: number, matrix: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare function skewX(angle: number, matrix: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare function skewY(angle: number, matrix: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare function transform(matrix: Float64Array | number[], props: Float64Array | number[], setMatrix: Float64Array | number[]): void;
export declare function transformPoints(points: IInteractionPoint[], matrix: Float64Array | number[]): void;
export declare function transformPoint(point: IInteractionPoint, matrix: Float64Array | number[]): void;
export declare function set(target: Float64Array | number[], source: Float64Array | number[]): void;
export declare function reset(target: Float64Array | number[]): void;
export declare function chain(value?: Float64Array | number[], immutable?: boolean): IMatrix;
