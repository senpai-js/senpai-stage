import { IContainer } from "./Container";
import { IInteractionManagerProps, InteractionManager } from "./InteractionManager";
import { ISprite } from "./Sprite";

export interface IStageProps extends IInteractionManagerProps {

}

export interface IStage extends IContainer {
  update(): this;
  render(): this;
  skipAnimations(): boolean;
}

export class Stage extends InteractionManager implements IStage {
  constructor(props: IStageProps) {
    super(props);
  }
  public update(): this {
    const now = Date.now();
    let sprite: ISprite;

    super.emit("pre-interpolate");
    for (sprite of this.sprites) {
      sprite.interpolate(now);
    }
    super.emit("post-interpolate");

    super.emit("pre-hover-check");
    this.hoverCheck(now);
    super.emit("post-hover-check");

    super.emit("pre-update");
    for (sprite of this.sprites) {
      sprite.update();
    }
    super.emit("post-update");

    return this;
  }

  public render(): this {
    super.emit("pre-render");
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

    super.emit("post-render");
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
