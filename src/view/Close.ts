import { Cursor, SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface IClose extends ISprite {

}

export interface ICloseProps extends ISpriteProps {

}

export class Close extends Sprite implements IClose {
  public readonly type: SpriteType = SpriteType.Close;

  constructor(props: ICloseProps) {
    super(props);
  }
  public update(): void {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    this.setTexture(`${active}_${hover}`);

    this.cursor = this.hover ? Cursor.pointer : Cursor.auto;
    super.update();
  }
}
