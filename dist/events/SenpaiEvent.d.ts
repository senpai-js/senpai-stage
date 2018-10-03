import { IContainer } from "../view/Container";
import { IInteractionManager } from "../view/InteractionManager";
import { ISprite } from "../view/Sprite";
export declare type EventCallback<T> = (events: T) => void;
export interface ISenpaiEvent {
    eventType: string;
    stage: IContainer;
    source: ISprite | IInteractionManager;
}
export interface IValueChangeEvent<T> extends ISenpaiEvent {
    eventType: "ValueChange";
    property: string;
    value: T;
    previousValue: T;
}
export interface IDisposer {
    dispose: () => void;
}
export declare class EventEmitter<T extends ISenpaiEvent> {
    callbacks: Array<EventCallback<T>>;
    clear(): void;
    listen(callback: EventCallback<T>): IDisposer;
    promise(): Promise<T>;
    once(callback: EventCallback<T>): IDisposer;
    emit(events: T): void;
}
