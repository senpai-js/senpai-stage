import { IInteractionPoint } from "../util";
import { ISprite } from "../view/Sprite";
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
    transformPoint(point: IInteractionPoint): this;
}
export declare const Identity: CanvasMatrix2D;
export declare function copy(input: CanvasMatrix2D): CanvasMatrix2DTransformAPI;
export declare function use(input: CanvasMatrix2D): CanvasMatrix2DTransformAPI;
export declare function transformPoint(point: IInteractionPoint, matrix: CanvasMatrix2D): void;
export declare function rads(degrees: number): number;
export declare function degs(radians: number): number;
export declare enum StagePosition {
    BottomCenter = 0,
    BottomCenterLeft = 1,
    BottomCenterRight = 2,
    BottomLeft = 3,
    BottomRight = 4,
    CenterLeft = 5,
    Center = 6,
    CenterRight = 7,
    Left = 8,
    Right = 9,
    TopCenter = 10,
    TopCenterLeft = 11,
    TopCenterRight = 12,
    TopLeft = 13,
    TopRight = 14
}
export declare function align(sprite: ISprite, position: StagePosition): CanvasMatrix2DTransformAPI;
