import {
  EventEmitter,
  IPostHoverCheckEvent,
  IPostInterpolateEvent,
  IPostRenderEvent,
  IPostUpdateEvent,
  IPreHoverCheckEvent,
  IPreInterpolateEvent,
  IPreRenderEvent,
  IPreUpdateEvent,
} from "../events";
import { IContainer } from "./Container";
import { IInteractionManagerProps, InteractionManager } from "./InteractionManager";
import { ISprite } from "./Sprite";

export interface IStageProps extends IInteractionManagerProps {

}

export interface IStage extends IContainer {
  postInterpolateEvent: EventEmitter<IPostInterpolateEvent>;
  preInterpolateEvent: EventEmitter<IPreInterpolateEvent>;
  preUpdateEvent: EventEmitter<IPreUpdateEvent>;
  postUpdateEvent: EventEmitter<IPostUpdateEvent>;
  preRenderEvent: EventEmitter<IPreRenderEvent>;
  postRenderEvent: EventEmitter<IPostRenderEvent>;
  update(): this;
  render(): this;
  skipAnimations(): boolean;
}

export class Stage extends InteractionManager implements IStage {
  public postInterpolateEvent: EventEmitter<IPostInterpolateEvent> = new EventEmitter<IPostInterpolateEvent>();
  public preInterpolateEvent: EventEmitter<IPreInterpolateEvent> = new EventEmitter<IPreInterpolateEvent>();
  public preHoverCheckEvent: EventEmitter<IPreHoverCheckEvent> = new EventEmitter<IPreHoverCheckEvent>();
  public postHoverCheckEvent: EventEmitter<IPostHoverCheckEvent> = new EventEmitter<IPostHoverCheckEvent>();
  public preUpdateEvent: EventEmitter<IPreUpdateEvent> = new EventEmitter<IPreUpdateEvent>();
  public postUpdateEvent: EventEmitter<IPostUpdateEvent> = new EventEmitter<IPostUpdateEvent>();
  public preRenderEvent: EventEmitter<IPreRenderEvent> = new EventEmitter<IPreRenderEvent>();
  public postRenderEvent: EventEmitter<IPostRenderEvent> = new EventEmitter<IPostRenderEvent>();

  constructor(props: IStageProps) {
    super(props);
  }
  public update(): this {
    const now = Date.now();
    let sprite: ISprite;

    this.preInterpolateEvent.emit({
      eventType: "PreInterpolate",
      source: this,
      stage: this,
    });
    for (sprite of this.sprites) {
      sprite.interpolate(now);
    }
    this.postInterpolateEvent.emit({
      eventType: "PostInterpolate",
      source: this,
      stage: this,
    });

    this.preHoverCheckEvent.emit({
      eventType: "PreHoverCheck",
      source: this,
      stage: this,
    });
    this.hoverCheck(now);
    this.postHoverCheckEvent.emit({
      eventType: "PostHoverCheck",
      source: this,
      stage: this,
    });

    this.preUpdateEvent.emit({
      eventType: "PreUpdate",
      source: this,
      stage: this,
    });

    for (sprite of this.sprites) {
      sprite.update();
    }

    this.postUpdateEvent.emit({
      eventType: "PostUpdate",
      source: this,
      stage: this,
    });

    return this;
  }

  public render(): this {
    this.preRenderEvent.emit({
      eventType: "PreRender",
      source: this,
      stage: this,
    });

    let sprite: ISprite;
    let pointer: boolean = false;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (sprite of this.sprites) {
      ctx.save();
      ctx.setTransform(
        sprite.interpolatedPosition[0],
        sprite.interpolatedPosition[1],
        sprite.interpolatedPosition[2],
        sprite.interpolatedPosition[3],
        sprite.interpolatedPosition[4],
        sprite.interpolatedPosition[5],
      );
      ctx.globalAlpha = sprite.interpolatedPosition[6];
      sprite.render(ctx);
      ctx.restore();
      pointer = pointer || (sprite.hover && sprite.cursor === "pointer");
    }

    this.canvas.style.cursor = pointer ? "pointer" : "default";

    this.postRenderEvent.emit({
      eventType: "PostRender",
      source: this,
      stage: this,
    });
    return this;
  }

  public skipAnimations(): boolean {
    const now = Date.now();
    let result = false;
    for (const sprite of this.sprites) {
      if (sprite.skipAnimation(now)) {
        result = true;
      }
    }
    return result;
  }
}
