import { ISpriteSheet } from "../spritesheet";
import { Character, ICharacter } from "../view/Character";
import { IStage, IStageProps, Stage } from "../view/Stage";

export type InterpreterValue = number | string | boolean | null;
export type InterpreterScript = (interpreter: IInterpreter) => Promise<IInterpreterResult>;

export interface IInterpreterValueMap {
  [key: string]: InterpreterValue;
}

export interface IScriptMap {
  [key: string]: InterpreterScript;
}

export enum InterpreterResultType {
  Jump,
  End,
}

export interface IInterpreterResult {
  type: InterpreterResultType;
  script: string;
}

export const jump = (to: string): IInterpreterResult => ({
  script: to,
  type: InterpreterResultType.Jump,
});

export const end = (): IInterpreterResult => ({
  script: null,
  type: InterpreterResultType.End,
});

export interface ICharacterMap {
  [id: string]: ICharacter;
}

export interface IInterpreter extends IStage {
  characters: ICharacterMap;
  data: IInterpreterValueMap;
  flags: IInterpreterValueMap;
  persist: IInterpreterValueMap;
  scripts: IScriptMap;

  getFlag(key: string): InterpreterValue;
  setFlag(key: string, value: InterpreterValue): InterpreterValue;
  getData(key: string): InterpreterValue;
  setData(key: string, value: InterpreterValue): InterpreterValue;
  getPersist(key: string): InterpreterValue;
  setPersist(key: string, value: InterpreterValue): InterpreterValue;
  setScripts(...scripts: IScriptMap[]): this;
  getScript(script: string): InterpreterScript;
  loadCharacter(
    id: string,
    name: string,
    color: string,
    definition: Promise<ISpriteSheet>,
    source: Promise<ImageBitmap>,
  ): this;
}

export interface IInterpreterProps extends IStageProps {

}

export class Interpreter extends Stage implements IInterpreter {
  public characters: ICharacterMap = {};
  public data: IInterpreterValueMap = {};
  public flags: IInterpreterValueMap = {};
  public persist: IInterpreterValueMap = {};
  public scripts: IScriptMap = {};

  constructor(props: IInterpreterProps) {
    super(props);
  }

  public getFlag(key: string): InterpreterValue {
    if (!this.flags.hasOwnProperty(key)) {
      throw new Error(`Cannot get data key ${key}: key does not exist.`);
    }
    return this.flags[key];
  }

  public setFlag(key: string, value: InterpreterValue): InterpreterValue {
    if (this.flags.hasOwnProperty(key)) {
      throw new Error(`Cannot set flag ${key}: flag already exists.`);
    }
    return this.flags[key] = value;
  }

  public setData(key: string, value: InterpreterValue): InterpreterValue {
    return this.data[key] = value;
  }

  public getData(key: string): InterpreterValue {
    if (!this.data.hasOwnProperty(key)) {
      throw new Error(`Cannot get data key ${key}: key does not exist.`);
    }
    return this.data[key];
  }

  public setPersist(key: string, value: InterpreterValue): InterpreterValue {
    return this.persist[key] = value;
  }

  public getPersist(key: string): InterpreterValue {
    if (!this.persist.hasOwnProperty(key)) {
      throw new Error(`Cannot get persist key ${key}: key does not exist.`);
    }
    return this.persist[key];
  }

  public setScripts(...scripts: IScriptMap[]): this {
    Object.assign(this.scripts, ...scripts);
    return this;
  }

  public getScript(script: string): InterpreterScript {
    if (!this.scripts.hasOwnProperty(script) || !this.scripts[script]) {
      throw new Error(`Cannot get script ${script}: script does not exist.`);
    }
    return this.scripts[script];
  }

  public loadCharacter(
    id: string,
    name: string,
    color: string,
    definition: Promise<ISpriteSheet>,
    source: Promise<ImageBitmap>,
    ): this {
    this.characters[id] = new Character({
      alpha: 1,
      color,
      definition,
      displayName: name,
      id,
      position: [1, 0, 0, 1, 0, 0],
      source,
      z: 0,
    });
    return this;
  }
}
