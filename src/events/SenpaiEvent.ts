import { ISprite } from "../view/Sprite";
import { IStage } from "../view/Stage";

export type EventCallback<T> = (props: T) => void;

export interface ISenpaiEvent {
  eventType: string;
  stage: IStage;
  source: ISprite | IStage;
}

export interface IValueChangeEvent<T> extends ISenpaiEvent {
  eventType: "ValueChange";
  property: string;
  value: T;
  previousValue: T;
}

interface IDisposer {
  dispose: () => void;
}

export class EventEmitter<T extends ISenpaiEvent> {
  public callbacks: Array<EventCallback<T>> = [];
  public clear() {
    this.callbacks = [];
  }
  public on(callback: EventCallback<T>): IDisposer {
    this.callbacks.push(callback);
    return {
      dispose: () => {
        if (this.callbacks.includes(callback)) {
          this.callbacks.splice(
            this.callbacks.indexOf(callback),
            1,
          );
        }
      },
    };
  }
  public once(callback: EventCallback<T>): IDisposer {
    const disposer = this.on((props: T) => {
      callback(props);
      disposer.dispose();
    });
    return disposer;
  }
  public emit(props: T): void {
    for (const callback of this.callbacks.slice()) {
      callback(props);
    }
  }
}
