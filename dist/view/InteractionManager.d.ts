import { EventEmitter, IKeyDownEvent, IKeyUpEvent, IMouseDownEvent, IMouseMoveEvent, IMouseUpEvent, IPointDownEvent, IPointMoveEvent, IPointUpEvent, ITouchCancelEvent, ITouchEndEvent, ITouchMoveEvent, ITouchStartEvent } from "../events";
import { IInteractionPoint, IKeyable } from "../util";
import { Container, IContainer, IContainerProps } from "./Container";
import { ISprite } from "./Sprite";
interface IInteractionPointIndex {
    [id: number]: IInteractionPoint;
}
interface IKeyIndex {
    [key: string]: boolean;
}
export interface IInteractionManager extends IContainer {
    canvas: HTMLCanvasElement;
    mousePoint: IInteractionPoint;
    touchPointIndex: IInteractionPointIndex;
    keyIndex: IKeyIndex;
    pointDownEvent: EventEmitter<IPointDownEvent>;
    pointUpEvent: EventEmitter<IPointUpEvent>;
    pointMoveEvent: EventEmitter<IPointMoveEvent>;
    mouseDownEvent: EventEmitter<IMouseDownEvent>;
    mouseUpEvent: EventEmitter<IMouseUpEvent>;
    mouseMoveEvent: EventEmitter<IMouseMoveEvent>;
    touchCancelEvent: EventEmitter<ITouchCancelEvent>;
    touchEndEvent: EventEmitter<ITouchEndEvent>;
    touchMoveEvent: EventEmitter<ITouchMoveEvent>;
    touchStartEvent: EventEmitter<ITouchStartEvent>;
    keyDownEvent: EventEmitter<IKeyDownEvent>;
    keyUpEvent: EventEmitter<IKeyUpEvent>;
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
    keyDown(event: KeyboardEvent | IKeyable): void;
    keyUp(event: KeyboardEvent | IKeyable): void;
    setFocus(target: ISprite): void;
    getFocusedSprite(): void;
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
    keyIndex: IKeyIndex;
    mousePoint: IInteractionPoint;
    pointDownEvent: EventEmitter<IPointDownEvent>;
    pointUpEvent: EventEmitter<IPointUpEvent>;
    pointMoveEvent: EventEmitter<IPointMoveEvent>;
    mouseDownEvent: EventEmitter<IMouseDownEvent>;
    mouseUpEvent: EventEmitter<IMouseUpEvent>;
    mouseMoveEvent: EventEmitter<IMouseMoveEvent>;
    touchCancelEvent: EventEmitter<ITouchCancelEvent>;
    touchEndEvent: EventEmitter<ITouchEndEvent>;
    touchMoveEvent: EventEmitter<ITouchMoveEvent>;
    touchStartEvent: EventEmitter<ITouchStartEvent>;
    keyDownEvent: EventEmitter<IKeyDownEvent>;
    keyUpEvent: EventEmitter<IKeyUpEvent>;
    private events;
    private keyboardEvents;
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
    keyUp(e: KeyboardEvent | IKeyable): void;
    keyDown(e: KeyboardEvent | IKeyable): void;
    setFocus(target: ISprite): void;
    getFocusedSprite(): ISprite;
}
export {};
