import { transformPoint } from "../matrix";
import { IInteractionPoint, IPadding, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

const sortZ = (a: ISprite, b: ISprite): number => a.z - b.z;
const tmpctx = document.createElement("canvas").getContext("2d");

export interface IPanel extends ISprite {
  padding: IPadding;
  addSprite(sprite: ISprite): this;
  removeSprite(sprite: ISprite): this;
  focus(sprite: ISprite): void;
}

export interface IPanelProps extends ISpriteProps {
  padding?: IPadding;
  width: number;
  height: number;
}

export class Panel extends Sprite implements IPanel {
  public readonly type: SpriteType = SpriteType.Panel;
  public padding: IPadding = {
    bottom: 4,
    left: 4,
    right: 4,
    top: 4,
  };
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
    this.padding = props.padding || this.padding;
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

  public isHovering(point: IInteractionPoint, now: number): ISprite {
    const isHovering = super.isHovering(point, now);
    if (!isHovering) {
      return null;
    }
    this.sprites.sort(sortZ);
    for (const sprite of this.sprites) {
      sprite.down = false;
      sprite.hover = false;
    }
    let hovering: ISprite;
    for (let i = this.sprites.length - 1; i >= 0; i--) {
      hovering = this.sprites[i].isHovering(point, now);
      if (hovering) {
        return hovering;
      }
    }
    return isHovering;
  }

  public narrowPhase(point: IInteractionPoint): ISprite {
    if (
      point.tx >= this.padding.left
      && point.tx <= (this.width - this.padding.right)
      && point.ty >= this.padding.top
      && point.ty <= (this.height - this.padding.bottom)
    ) {
      return this;
    }
  }

  public removeSprite(sprite: ISprite): this {
    if (this.sprites.includes(sprite)) {
      this.sprites.splice(this.sprites.indexOf(sprite), 1);
      sprite.parent = null;
    }

    return this;
  }

  public update(): void {
    this.hover = false;
    if (!this.bottomCenterPattern && this.textures.Bottom_Center) {
      this.bottomCenterPattern = tmpctx.createPattern(this.textures.Bottom_Center as any, "repeat-x");
    }
    if (!this.topCenterPattern && this.textures.Top_Center) {
      this.topCenterPattern = tmpctx.createPattern(this.textures.Top_Center as any, "repeat-x");
    }
    if (!this.middleLeftPattern && this.textures.Middle_Left) {
      this.middleLeftPattern = tmpctx.createPattern(this.textures.Middle_Left as any, "repeat-y");
    }
    if (!this.middleRightPattern && this.textures.Middle_Right) {
      this.middleRightPattern = tmpctx.createPattern(this.textures.Middle_Right as any, "repeat-y");
    }
    if (!this.middleCenterPattern && this.textures.Middle_Center) {
      this.middleCenterPattern = tmpctx.createPattern(this.textures.Middle_Center as any, "repeat");
    }
    if (
      this.textures.Top_Left
      && this.textures.Top_Right
      && this.textures.Bottom_Left
      && this.textures.Bottom_Right
    ) {
      this.width = Math.max(
        this.width,
        this.textures.Bottom_Left.width + this.textures.Bottom_Right.width,
        this.textures.Top_Left.width + this.textures.Top_Right.width,
      );
      this.height = Math.max(
        this.height,
        this.textures.Bottom_Left.width + this.textures.Top_Left.width,
        this.textures.Bottom_Right.width + this.textures.Top_Right.width,
      );
    }
    for (const sprite of this.sprites) {
      sprite.update();
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.textures.Top_Left) {
      ctx.drawImage(this.textures.Top_Left, 0, 0);
    }
    if (this.textures.Top_Right) {
      ctx.drawImage(this.textures.Top_Right, this.width - this.textures.Top_Right.width, 0);
    }
    if (this.textures.Bottom_Left) {
      ctx.drawImage(this.textures.Bottom_Left, 0, this.height - this.textures.Bottom_Left.width);
    }
    if (this.textures.Bottom_Right) {
      ctx.drawImage(
        this.textures.Bottom_Right,
        this.width - this.textures.Bottom_Right.width,
        this.height - this.textures.Bottom_Right.height,
      );
    }
    if (this.topCenterPattern) {
      ctx.beginPath();
      ctx.fillStyle = this.topCenterPattern;
      ctx.fillRect(
        this.textures.Top_Left.width,
        0,
        this.width - this.textures.Top_Left.width - this.textures.Top_Right.width,
        this.textures.Top_Center.height,
      );
    }
    if (this.bottomCenterPattern) {
      const bottomCenterY = this.height - this.textures.Bottom_Center.height;
      ctx.beginPath();
      ctx.fillStyle = this.bottomCenterPattern;
      ctx.translate(0, bottomCenterY);
      ctx.fillRect(
        this.textures.Bottom_Left.width,
        0,
        this.width - this.textures.Bottom_Left.width - this.textures.Bottom_Right.width,
        this.textures.Bottom_Center.height,
      );
      ctx.translate(0, -bottomCenterY);
    }
    if (this.middleLeftPattern) {
      ctx.beginPath();
      ctx.fillStyle = this.middleLeftPattern;
      ctx.fillRect(
        0,
        this.textures.Top_Left.height,
        this.textures.Middle_Left.width,
        this.height - this.textures.Top_Left.height - this.textures.Bottom_Left.height,
      );
    }
    if (this.middleRightPattern) {
      const middleRightX = this.width - this.textures.Top_Right.width;
      ctx.beginPath();
      ctx.fillStyle = this.middleRightPattern;
      ctx.translate(middleRightX, 0);
      ctx.fillRect(
        0,
        this.textures.Top_Right.height,
        this.textures.Middle_Right.width,
        this.height - this.textures.Top_Right.height - this.textures.Bottom_Right.height,
      );
      ctx.translate(-middleRightX, 0);
    }
    if (this.middleCenterPattern) {
      ctx.beginPath();
      ctx.fillStyle = this.middleCenterPattern;
      ctx.fillRect(
        this.textures.Top_Left.width,
        this.textures.Top_Right.height,
        this.width - this.textures.Bottom_Right.width - this.textures.Bottom_Left.width,
        this.height - this.textures.Top_Right.height - this.textures.Bottom_Right.height,
      );
    }

    ctx.beginPath();
    ctx.rect(
      this.padding.left,
      this.padding.top,
      this.width - this.padding.left - this.padding.right,
      this.height - this.padding.top - this.padding.bottom,
    );
    ctx.clip();
    ctx.translate(this.padding.left, this.padding.top);
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
