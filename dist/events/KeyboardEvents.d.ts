import { ISenpaiEvent } from "./SenpaiEvent";
export interface IKeyboardEvent extends ISenpaiEvent {
    key: string;
    down: boolean;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
}
export interface IKeyDownEvent extends IKeyboardEvent {
    eventType: "KeyDown";
    down: true;
}
export interface IKeyUpEvent extends IKeyboardEvent {
    eventType: "KeyUp";
    down: false;
}
export interface IKeyPressEvent extends IKeyboardEvent {
    eventType: "KeyPress";
    down: true;
}
