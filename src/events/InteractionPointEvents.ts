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

export interface IRawPointEvent extends ISenpaiEvent {
  down: boolean;
  x: number;
  y: number;
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

export interface IMouseMoveEvent extends IRawPointEvent {
  eventType: "MouseMove";
  rawEvent: MouseEvent;
}

export interface IMouseDownEvent extends IRawPointEvent {
  eventType: "MouseDown";
  rawEvent: MouseEvent;
}

export interface IMouseUpEvent extends IRawPointEvent {
  eventType: "MouseUp";
  rawEvent: MouseEvent;
}

export interface ITouchStartEvent extends IRawPointEvent {
  eventType: "TouchStart";
  touch: Touch;
  rawEvent: TouchEvent;
}

export interface ITouchMoveEvent extends IRawPointEvent {
  eventType: "TouchMove";
  touch: Touch;
  rawEvent: TouchEvent;
}

export interface ITouchEndEvent extends IRawPointEvent {
  eventType: "TouchEnd";
  touch: Touch;
  rawEvent: TouchEvent;
}

export interface ITouchCancelEvent extends IRawPointEvent {
  eventType: "TouchCancel";
  x: null;
  y: null;
  touch: Touch;
  rawEvent: TouchEvent;
}
