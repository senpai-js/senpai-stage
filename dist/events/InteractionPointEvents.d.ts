import { IInteractionPoint } from "../util";
import { ISenpaiEvent } from "./SenpaiEvent";
export interface IPointEvent extends ISenpaiEvent {
    point: IInteractionPoint;
    down: boolean;
    x: number;
    y: number;
    previousX: number;
    previousY: number;
}
export interface IPointMoveEvent extends IPointEvent {
    eventType: "PointMove";
}
export interface IMouseMoveEvent extends IPointEvent {
    eventType: "MouseMove";
}
export interface IMouseDownEvent extends IPointEvent {
    eventType: "MouseDown";
}
export interface IMouseUpEvent extends IPointEvent {
    eventType: "MouseUp";
}
export interface ITouchCreateEvent extends IPointEvent {
    eventType: "TouchCreate";
}
export interface ITouchMoveEvent extends IPointEvent {
    eventType: "TouchMove";
}
export interface ITouchDestroyEvent extends IPointEvent {
    eventType: "TouchDestroy";
    x: null;
    y: null;
}
export interface ITouchCancelEvent extends IPointEvent {
    eventType: "TouchCancel";
    x: null;
    y: null;
}
