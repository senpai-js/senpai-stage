import { IInteractionPoint } from "../util";
import { Container, IContainer, IContainerProps } from "./Container";
interface IInteractionPointIndex {
    [id: number]: IInteractionPoint;
}
export interface IInteractionManager extends IContainer {
    canvas: HTMLCanvasElement;
    mousePoint: IInteractionPoint;
    touchPointIndex: IInteractionPointIndex;
    hookEvents(): void;
    dispose(): void;
    createInteractionPoint(id: string, type: "Touch" | "Mouse"): IInteractionPoint;
    addTouchPoint(touch: Touch): IInteractionPoint;
    removeTouchPoint(touch: Touch): void;
    pointDown(point: IInteractionPoint, position: Touch | MouseEvent): void;
    pointUp(point: IInteractionPoint, position: Touch | MouseEvent): void;
    pointMove(point: IInteractionPoint, position: Touch | MouseEvent): void;
    pointCancel(point: IInteractionPoint, position: Touch | MouseEvent): void;
    mouseDown(event: MouseEvent): void;
    mouseUp(event: MouseEvent): void;
    mouseMove(event: MouseEvent): void;
    touchStart(event: TouchEvent): void;
    touchEnd(event: TouchEvent): void;
    touchMove(event: TouchEvent): void;
    touchCancel(event: TouchEvent): void;
}
export interface IInteractionManagerProps extends IContainerProps {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
}
export declare class InteractionManager extends Container implements IInteractionManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    touchPointIndex: IInteractionPointIndex;
    mousePoint: IInteractionPoint;
    private events;
    constructor(props: IInteractionManagerProps);
    hookEvents(): void;
    dispose(): void;
    mouseDown(event: MouseEvent): void;
    mouseUp(event: MouseEvent): void;
    mouseMove(event: MouseEvent): void;
    touchStart(event: TouchEvent): void;
    touchEnd(event: TouchEvent): void;
    touchCancel(event: TouchEvent): void;
    touchMove(event: TouchEvent): void;
    pointDown(point: IInteractionPoint, position: Touch | MouseEvent): void;
    pointUp(point: IInteractionPoint, position: Touch | MouseEvent): void;
    pointMove(point: IInteractionPoint, position: Touch | MouseEvent): void;
    pointCancel(point: IInteractionPoint, position: Touch | MouseEvent): void;
    createInteractionPoint(id: string, type: "Touch" | "Mouse"): IInteractionPoint;
    addTouchPoint(touch: Touch): IInteractionPoint;
    removeTouchPoint(touch: Touch): void;
    hoverCheck(now: number): void;
}
export {};
