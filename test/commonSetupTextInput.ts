import { setup, TestSetup } from "./senpaiTestSetup";

export function common() {
  return setup()
    .perform(t => t
      .addTextInput("sprite", 50, 50)
      .setSize("sprite", 50, 50)
      .addInteractionPoint("ip", "Touch")
      .addEventCallback("pointMoveEvent", "pointMoveEvent", "sprite")
      .addEventCallback("pointDownEvent", "pointDownEvent", "sprite")
      .addEventCallback("pointUpEvent", "pointUpEvent", "sprite")
      .addEventCallback("pointClickEvent", "pointClickEvent", "sprite"),
    )
    .placeholder()
    .placeholder()
    .perform(t => t.updateStage().renderStage());
}

export function pointMoveOrderCommon() {
  return setup()
    .placeholder() // order of adding/positioning label/ip
    .perform(t => t.addEventCallback("pointMoveEvent", "pointMoveEvent", "sprite"))
    .placeholder() // whether ip moves after or not
    .perform(t => t.updateStage().renderStage());
}

export function awayUp(t: TestSetup) {
  return t.pointUp("ip", 0, 0);
}

export function awayDown(t: TestSetup) {
  return t.pointDown("ip", 0, 0);
}

export function hoverUp(t: TestSetup) {
  return t.pointUp("ip", 60, 60);
}

export function hoverDown(t: TestSetup) {
  return t.pointDown("ip", 60, 60);
}

export function noop(t: TestSetup) {
  return t;
}
