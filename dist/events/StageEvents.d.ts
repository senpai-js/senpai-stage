import { ISenpaiEvent } from "./SenpaiEvent";
export interface IPostInterpolateEvent extends ISenpaiEvent {
    eventType: "PostInterpolate";
}
export interface IPreInterpolateEvent extends ISenpaiEvent {
    eventType: "PreInterpolate";
}
export interface IPreHoverCheckEvent extends ISenpaiEvent {
    eventType: "PreHoverCheck";
}
export interface IPostHoverCheckEvent extends ISenpaiEvent {
    eventType: "PostHoverCheck";
}
export interface IPreUpdateEvent extends ISenpaiEvent {
    eventType: "PreUpdate";
}
export interface IPostUpdateEvent extends ISenpaiEvent {
    eventType: "PostUpdate";
}
export interface IPreRenderEvent extends ISenpaiEvent {
    eventType: "PreRender";
}
export interface IPostRenderEvent extends ISenpaiEvent {
    eventType: "PostRender";
}
