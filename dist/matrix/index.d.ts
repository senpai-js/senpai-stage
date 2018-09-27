import { IInteractionPoint } from "../util";
export declare type CanvasMatrix2D = [number, number, number, number, number, number];
export declare class CanvasMatrix2DTransformAPI {
    value: CanvasMatrix2D;
    constructor(input: CanvasMatrix2D);
    translate(x: number, y: number): this;
    scale(x: number, y: number): this;
    rotate(radians: number): this;
    skewX(radians: number): this;
    skewY(radians: number): this;
    inverse(): this;
    transform(props: CanvasMatrix2D): this;
    reset(): this;
    set(props: CanvasMatrix2D): this;
    setTo(target: CanvasMatrix2D): this;
}
export declare const Identity: CanvasMatrix2D;
export declare function transformCopy2D(input: CanvasMatrix2D): CanvasMatrix2DTransformAPI;
export declare function transform2D(input: CanvasMatrix2D): CanvasMatrix2DTransformAPI;
export declare function transformPoint(point: IInteractionPoint, matrix: CanvasMatrix2D): void;
export declare function rads(degrees: number): number;
export declare function degs(radians: number): number;
