import { ISprite, ISpriteProps, Sprite } from "./Sprite";

export interface ICharacterProps extends ISpriteProps {
  name: string;
  displayName: string;
  color: string;
}

export interface ICharacter extends ISprite {
  name: string;
  displayName: string;
  color: string;
}

export class Character extends Sprite implements ICharacter {
  public name: string = "";
  public displayName: string = "";
  public color: string = "";
  constructor(props: ICharacterProps) {
    super(props);
    this.name = props.name;
    this.displayName = props.displayName;
    this.color = props.color;
  }
}
