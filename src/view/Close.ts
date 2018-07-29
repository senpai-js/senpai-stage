import assert from "assert";
import { createTextureMap, ILoadProps, ITextureMap, loadImage } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface IClose extends ISprite {

}

export interface ICloseProps extends ISpriteProps {

}

export class Close extends Sprite implements IClose {
  constructor(props: ICloseProps) {
    super(props);
  }
  public update(): void {
    const active = this.active ? "Active" : "Inactive";
    const hover = this.hover ? "Hover" : "NoHover";
    this.setTexture(`${active}_${hover}`);

    this.cursor = this.hover ? "pointer" : "default";
    super.update();
  }
}

export interface ILoadCloseProps extends ICloseProps, ILoadProps {

}

export async function loadClose(props: ILoadCloseProps): Promise<IClose> {
  const img = loadImage(props.src);
  const textures: ITextureMap = await createTextureMap(props.definition, img);

  ["Active", "Inactive"].forEach(active => {
    ["Hover", "NoHover"].forEach(hover => {
      assert(textures[`${active}_${hover}`]);
    });
  });

  props.textures = textures;
  const button = new Close(props);

  return button;
}
