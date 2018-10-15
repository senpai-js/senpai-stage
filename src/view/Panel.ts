import { transformPoint } from "../matrix";
import { IInteractionPoint, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

const sortZ = (a: ISprite, b: ISprite): number => a.z - b.z;
const tmpctx = document.createElement("canvas").getContext("2d");

export interface IPanel extends ISprite {
  addSprite(sprite: ISprite): this;
  removeSprite(sprite: ISprite): this;
  focus(sprite: ISprite): void;
}

export interface IPanelProps extends ISpriteProps {
  width: number;
  height: number;
}

export class Panel extends Sprite implements IPanel {
  public readonly type: SpriteType = SpriteType.Panel;
  private sprites: ISprite[] = [];
  private bottomCenterPattern: CanvasPattern = null;
  private topCenterPattern: CanvasPattern = null;
  private middleLeftPattern: CanvasPattern = null;
  private middleRightPattern: CanvasPattern = null;
  private middleCenterPattern: CanvasPattern = null;

  constructor(props: IPanelProps) {
    super(props);
    this.width = props.width;
    this.height = props.height;
  }

  public addSprite(sprite: ISprite): this {
    sprite.parent = this;
    this.sprites.push(sprite);
    return this;
  }

  public interpolate(now: number) {
    if (now <= this.lastInterpolated) {
      return;
    }
    super.interpolate(now);
    for (const sprite of this.sprites) {
      sprite.interpolate(now);
    }
  }

  public removeSprite(sprite: ISprite): this {
    if (this.sprites.includes(sprite)) {
      this.sprites.splice(this.sprites.indexOf(sprite), 1);
      sprite.parent = null;
    }

    return this;
  }

  public broadPhase(point: IInteractionPoint): boolean {
    this.sprites.sort(sortZ);

    for (const sprite of this.sprites) {
      sprite.down = false;
      sprite.hover = false;
    }
    return super.broadPhase(point);
  }

  public narrowPhase(point: IInteractionPoint): ISprite {
    let sprite: ISprite = null;
    let collision: ISprite = null;

    for (let i = this.sprites.length - 1; i >= 0; i--) {
      sprite = this.sprites[i];

      // the sprites inverse has already been calculated relative to the parent
      transformPoint(point, sprite.inverse);

      if (!sprite.broadPhase(point)) {
        continue;
      }

      collision = sprite.narrowPhase(point);
      if (collision) {
        return collision;
      }
    }
    return this;
  }

  public update(): void {
    this.hover = false;
    if (!this.bottomCenterPattern && this.textures.Bottom_Center) {
      this.bottomCenterPattern = tmpctx.createPattern(this.textures.Bottom_Center, "repeat-x");
    }
    if (!this.topCenterPattern && this.textures.Top_Center) {
      this.topCenterPattern = tmpctx.createPattern(this.textures.Top_Center, "repeat-x");
    }
    if (!this.middleLeftPattern && this.textures.Middle_Left) {
      this.middleLeftPattern = tmpctx.createPattern(this.textures.Middle_Left, "repeat-y");
    }
    if (!this.middleRightPattern && this.textures.Middle_Right) {
      this.middleRightPattern = tmpctx.createPattern(this.textures.Middle_Right, "repeat-y");
    }
    if (!this.middleCenterPattern && this.textures.Middle_Center) {
      this.middleCenterPattern = tmpctx.createPattern(this.textures.Middle_Center, "repeat");
    }

    for (const sprite of this.sprites) {
      sprite.update();

      if (sprite.hover) {
        this.hover = sprite.hover;
        this.cursor = sprite.cursor;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {


    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();

    for (const sprite of this.sprites) {
      ctx.save();
      ctx.transform(
        sprite.interpolatedPosition[0],
        sprite.interpolatedPosition[1],
        sprite.interpolatedPosition[2],
        sprite.interpolatedPosition[3],
        sprite.interpolatedPosition[4],
        sprite.interpolatedPosition[5],
      );
      ctx.globalAlpha *= sprite.interpolatedAlpha;
      sprite.render(ctx);
      ctx.restore();
    }
  }

  public focus(target: ISprite) {
    for (const sprite of this.sprites) {
      sprite.focused = sprite === target;
      if (sprite.type === SpriteType.Panel) {
        const panel = sprite as IPanel;
        panel.focus(target);
      }
    }
  }

  public isFocused(): ISprite {
    for (const sprite of this.sprites) {
      if (sprite.isFocused()) {
        return sprite;
      }
    }
    return super.isFocused();
  }

  public skipAnimation(now: number): boolean {
    let result: boolean = super.skipAnimation(now);
    for (const sprite of this.sprites) {
      result = sprite.skipAnimation(now) || result;
    }
    return result;
  }
}
