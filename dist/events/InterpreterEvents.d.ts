import { ISenpaiEvent } from "./SenpaiEvent";
export interface IQuitEvent extends ISenpaiEvent {
    eventType: "Quit";
}
