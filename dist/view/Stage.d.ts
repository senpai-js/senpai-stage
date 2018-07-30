import { IContainer } from "./Container";
import { IInteractionManagerProps, InteractionManager } from "./InteractionManager";
export interface IStageProps extends IInteractionManagerProps {
}
export interface IStage extends IContainer {
    update(): this;
    render(): this;
    skipAnimations(): boolean;
}
export declare class Stage extends InteractionManager implements IStage {
    constructor(props: IStageProps);
    update(): this;
    render(): this;
    skipAnimations(): boolean;
}
