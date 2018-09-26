import { IAudio, IAudioProps, ISoundSpriteSheet, PlayState } from "../util";

export interface ISFX extends IAudio {
  loop: false; // it will always be false
}

export interface ISFXProps extends IAudioProps {
}

export interface ILoadSFXProps {
  name: string;
  texture: string;
}

export class SFXSprite implements ISFX {
  public id: string = "";
  // fields from IPlayable
  public started: number = 0;
  public length: number = 0;
  public start: number = 0;
  public end: number = 0;
  public loop: false = false;
  public state: PlayState = PlayState.Stopped; // unused
  public loaded: Promise<void>;

  // fields from IAudio
  public gain: GainNode;
  public source: AudioBuffer;
  public destination: AudioNode;
  public definition: ISoundSpriteSheet;
  public context: AudioContext;
  /**
   * 1. sets all relevant metadata properties from spritesheet
   * 2. creates gain node from context
   * 3. set this.loaded to result of createSource(props.source, props.context);
   * 4. set this.destination
   */
  constructor(props: ISFXProps) {
    this.id = props.id;
    // TODO: 1
    this.context = props.context;
    this.definition = props.definition;
    this.start = this.definition.spritemap[props.texture].start;
    this.end = this.definition.spritemap[props.texture].end;
    this.length = this.end - this.start;
    this.gain = props.context.createGain();
    this.loaded = this.createSource(props.source, props.context);
    this.destination = props.context.destination;
  }

  // calls this.loaded.then(e => this.createPlayInstance());
  public play(): this {
    this.loaded.then(e => this.createPlayInstance());
    return this;
  }

  // no ops
  public stop(): this {
    return this;
  }
  public pause(): this {
    return this;
  }

  // sets the gainNode.gain.value property
  // accepts [0..1]
  public setVolume(volume: number): this {
    if (volume < 0 || volume > 1) {
      throw new Error(`setVolume() accepts a number between 0 and 1; got ${volume}.`);
    }
    this.gain.gain.value = volume;
    return this;
  }

  /**
   * 1. resolves response to arrayBuffer
   * 2. creates audioBuffer
   * 3. creates AudioBufferSourceNode
   * 4. sets source property
   */
  private async createSource(res: Promise<Response>, context: AudioContext): Promise<void> {
    const resp: Response = await res;
    const buffer = await resp.arrayBuffer();
    this.source = await context.decodeAudioData(buffer);
  }

  /**
   * 1. creates new AudioBufferSourceNode
   * 2. set node.buffer = this.source
   * 3. set source metadata
   * 4. connect node to destination
   * 5. call start(0, offset, duration)
   * 6. listen to ended event (look up the event)
   * 7. clean up audio source node and disconnect it from the destination
   */
  private createPlayInstance(): void {
    const node = this.context.createBufferSource();
    node.buffer = this.source;
    node.loop = this.loop; // false
    // TODO: 3
    node.connect(this.gain);

    const now = Date.now();
    node.start(0, this.start, this.length);

    const gain = this.gain; // must be accessed inside of named function
    node.addEventListener("ended", function callback(e) {
      node.disconnect(gain);
      node.removeEventListener("ended", callback);
    });
  }
}
