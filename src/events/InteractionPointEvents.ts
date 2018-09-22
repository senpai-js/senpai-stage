import { IInteractionPoint } from "../util";
import { ISprite } from "../view/Sprite";
import { ISenpaiEvent } from "./SenpaiEvent";

export interface IPointEvent extends ISenpaiEvent {
  point: IInteractionPoint;
  down: boolean;
  x: number;
  y: number;
  previousX: number;
  previousY: number;
}

export interface IPointDownEvent extends IPointEvent {
  eventType: "PointDown";
  down: true;
}

export interface IPointUpEvent extends IPointEvent {
  eventType: "PointUp";
  down: false;
}

export interface IPointClickEvent extends IPointEvent {
  eventType: "PointClick";
  down: false;
}

export interface IPointMoveEvent extends IPointEvent {
  eventType: "PointMove";
}

export interface IMouseMoveEvent extends IPointEvent {
  eventType: "MouseMove";
  rawEvent: MouseEvent;
}

export interface IMouseDownEvent extends IPointEvent {
  eventType: "MouseDown";
  rawEvent: MouseEvent;
}

export interface IMouseUpEvent extends IPointEvent {
  eventType: "MouseUp";
  rawEvent: MouseEvent;
}

export interface ITouchCreateEvent extends IPointEvent {
  eventType: "TouchCreate";
  touch: Touch;
  rawEvent: TouchEvent;
}

export interface ITouchMoveEvent extends IPointEvent {
  eventType: "TouchMove";
  touch: Touch;
  rawEvent: TouchEvent;
}

export interface ITouchDestroyEvent extends IPointEvent {
  eventType: "TouchDestroy";
  x: null;
  y: null;
  rawEvent: TouchEvent;
}

export interface ITouchCancelEvent extends IPointEvent {
  eventType: "TouchCancel";
  x: null;
  y: null;
  rawEvent: TouchEvent;
}
