import { EventEmitter, IPostHoverCheckEvent, IPostInterpolateEvent, IPostRenderEvent, IPostUpdateEvent, IPreHoverCheckEvent, IPreInterpolateEvent, IPreRenderEvent, IPreUpdateEvent } from "../events";
import { IInteractionManager, IInteractionManagerProps, InteractionManager } from "./InteractionManager";
export interface IStageProps extends IInteractionManagerProps {
}
export interface IStage extends IInteractionManager {
    postInterpolateEvent: EventEmitter<IPostInterpolateEvent>;
    preInterpolateEvent: EventEmitter<IPreInterpolateEvent>;
    preUpdateEvent: EventEmitter<IPreUpdateEvent>;
    postUpdateEvent: EventEmitter<IPostUpdateEvent>;
    preRenderEvent: EventEmitter<IPreRenderEvent>;
    postRenderEvent: EventEmitter<IPostRenderEvent>;
    update(): this;
    render(): this;
    skipAnimations(): boolean;
}
export declare class Stage extends InteractionManager implements IStage {
    postInterpolateEvent: EventEmitter<IPostInterpolateEvent>;
    preInterpolateEvent: EventEmitter<IPreInterpolateEvent>;
    preHoverCheckEvent: EventEmitter<IPreHoverCheckEvent>;
    postHoverCheckEvent: EventEmitter<IPostHoverCheckEvent>;
    preUpdateEvent: EventEmitter<IPreUpdateEvent>;
    postUpdateEvent: EventEmitter<IPostUpdateEvent>;
    preRenderEvent: EventEmitter<IPreRenderEvent>;
    postRenderEvent: EventEmitter<IPostRenderEvent>;
    constructor(props: IStageProps);
    update(): this;
    render(): this;
    skipAnimations(): boolean;
}
