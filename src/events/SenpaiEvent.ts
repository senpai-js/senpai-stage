import { ISprite } from "../view/Sprite";
import { IStage } from "../view/Stage";

export type EventCallback<T> = (events: T) => void;

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

export interface IDisposer {
  dispose: () => void;
}

export class EventEmitter<T extends ISenpaiEvent> {
  public callbacks: Array<EventCallback<T>> = [];
  public clear() {
    this.callbacks = [];
  }
  public listen(callback: EventCallback<T>): IDisposer {
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
  public promise(): Promise<T> {
    return new Promise((resolve, reject) => {
      const disposer = this.listen((event) => {
        disposer.dispose();
        resolve(event);
      });
    });
  }
  public once(callback: EventCallback<T>): IDisposer {
    const disposer = this.listen((events: T) => {
      callback(events);
      disposer.dispose();
    });
    return disposer;
  }

  public emit(events: T): void {
    for (const callback of this.callbacks.slice()) {
      callback(events);
    }
  }
}
