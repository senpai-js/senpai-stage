import { IAudio, IAudioProps, ISoundSpriteSheet, PlayState } from "../util";
export interface ISFX extends IAudio {
    loop: false;
}
export interface ISFXProps extends IAudioProps {
}
export interface ILoadSFXProps {
    name: string;
    texture: string;
}
export declare class SFXSprite implements ISFX {
    started: number;
    length: number;
    start: number;
    end: number;
    loop: false;
    state: PlayState;
    loaded: Promise<void>;
    gain: GainNode;
    source: AudioBuffer;
    destination: AudioNode;
    definition: ISoundSpriteSheet;
    context: AudioContext;
    /**
     * 1. sets all relevant metadata properties from spritesheet
     * 2. creates gain node from context
     * 3. set this.loaded to result of createSource(props.source, props.context);
     * 4. set this.destination
     */
    constructor(props: ISFXProps);
    play(): this;
    stop(): this;
    pause(): this;
    setVolume(volume: number): this;
    /**
     * 1. resolves response to arrayBuffer
     * 2. creates audioBuffer
     * 3. creates AudioBufferSourceNode
     * 4. sets source property
     */
    private createSource;
    /**
     * 1. creates new AudioBufferSourceNode
     * 2. set node.buffer = this.source
     * 3. set source metadata
     * 4. connect node to destination
     * 5. call start(0, offset, duration)
     * 6. listen to ended event (look up the event)
     * 7. clean up audio source node and disconnect it from the destination
     */
    private createPlayInstance;
}
