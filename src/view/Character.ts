import { SpriteType } from "../util";
import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ICharacterProps extends ISpriteProps {
  displayName: string;
  color: string;
}

export interface ICharacter extends ISprite {
  displayName: string;
  color: string;
}

export class Character extends Sprite implements ICharacter {
  public readonly type: SpriteType = SpriteType.Character;
  public name: string = "";
  public displayName: string = "";
  public color: string = "";
  constructor(props: ICharacterProps) {
    super(props);
    this.displayName = props.displayName;
    this.color = props.color;
  }
}
