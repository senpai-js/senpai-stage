import { Slider } from "../src/view/Slider";

import { setup } from "./setupUtil";

// TEST IDEA: Activate the slider, move the mouse point to N different points on
// the screen, and assert that at all times the value is between the extremes

// PARAMETERS:
// - value
// - max
// - min
// - width

// NOTE: Behavior on max <= min? Should this be allowed? Should it error?
// Should it silently reconfigure?
// ANSWER: Error

// NOTE: What happens if pointDown is called repeatedly with no pointUp in
// between when slider is active? Does the slider become inactive if the user
// calls pointDown on the outside of the body, even if the point is already
// down?
// ANSWER: TODO

// NOTE: I notice that some parts of the code uses "hasOwnProperty" to decide
// whether to set an optional property, while others use the || operator. Are
// there particular reasons to use one over the other, and would it be
// preferable to have the code refactored to consistently use one over the other
// if applicable?
// ^ not directly related to Slider behavior
// ANSWER: We can change this later

// TODO: Read up on slider implementation
describe("Slider tests", () => {
  const x = 50;
  const y = 50;

  /*
  const template = setup().template
    .perform(t => t
      .addSlider("slider", x, y)
      .setTextures("slider", new Image(20, 20)) // set all textures to a 20x20 image
      .addInteractionPoint("ip"))
    .placeholder()
    .perform(t => t.updateStage());
  */
  let template;
  beforeEach(() => {
    template = setup().template
      .perform(t => t
        .addSlider("slider", x, y)
        .setTextures("slider", new Image(20, 20)) // set all textures to a 20x20 image
        .addInteractionPoint("ip"))
      .placeholder()
      .perform(t => t.updateStage());
  })
  
  test("Hover over Slider body makes broadPhase() return true",  () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x+50, y)) // to the right of the pill by 30px
      .run()
      .values;
    
    expect(slider.broadPhase(ip)).toBe(true);
  });
  
  test("Hover over pill makes broadPhase() return true",  () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x, y))
      .run()
      .values;
    
    expect(slider.broadPhase(ip)).toBe(true);
  });
  
  test("Hover over Slider body makes narrowPhase() return undefined",  () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x+50, y)) // to the right of the pill by 30px
      .run()
      .values;

    expect(slider.narrowPhase(ip)).toBe(undefined);
  });
  
  test("Hover over pill makes narrowPhase() return slider",  () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x, y))
      .run()
      .values;
    
    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("Hover over Slider body does not change 'cursor' property to 'pointer'", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x+50, y)) // to the right of the pill by 30px
      .run()
      .values;

    expect(slider.cursor).toBe("default");
  });
  
  test("Hover over pill changes 'cursor' property to 'pointer'", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x, y))
      .run()
      .values;

    expect(slider.cursor).toBe("pointer");
  });

  test("Hover over Slider body does not change Slider value", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x+50, y))
      .run()
      .values;

    expect(slider.value).toBe(0);
  });
  
  /*
   * Reason for removal: Not prioritized

  test("Clicking outside Slider body does not change Slider value", () => {
    throw new Error("Not implemented");
  });
   */

  test("Clicking on Slider body changes Slider value", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x+50, y))
      .run()
      .values;

    expect(slider.value).not.toBe(0);
  });

  test("Clicking on Slider body fires value change event", () => {
    throw new Error("Not implemented");
  });
  
  test("Point down on pill makes narrowPhase return Slider", () =>  {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y))
      .run()
      .values;

    expect(slider.narrowPhase(ip)).toBe(slider);
  });
  
  test("When point was just pressed down on body, narrowPhase returns Slider", () =>  {
    // setup without any action in the placeholder spot
    let { points: {ip}, sprites: {slider} } = template.feed(t => t).run().values;
    ip.firstDown = true; // this indicates that the point was just pressed down

    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("Hover outside of body makes broadPhase return false", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x+200, y+100))
      .run()
      .values;

    expect(slider.broadPhase(ip)).toBe(false);
  });

  test("Hover outside of body makes narrowPhase return undefined", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.movePoint("ip", x+200, y+100))
      .run()
      .values;

    expect(slider.narrowPhase(ip)).toBe(undefined);
  });
  
  test("After point down and move narrowPhase still returns Slider", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x+200, y+100))
      .run()
      .values;

    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("After point down and move broadPhase still returns true", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x+200, y+100))
      .run()
      .values;

    expect(slider.broadPhase(ip)).toBe(true);
  });
  
  test("Activating the Slider and moving the point beyond the start stops the value at min", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", 0, y))
      .run()
      .values;

    expect(slider.value).toBe(slider.min);
  });
  
  test("Activating the Slider and moving the point beyond the end stops the value at max", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x+200, y))
      .run()
      .values;

    expect(slider.value).toBe(slider.max);
  });

  test("Moving point off slider while slider is active projects value onto slider", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x+50, y+100))
      .run()
      .values;

    throw new Error("Not implemented"); // TODO: compute expected value
  });
  
  test("Moving point off slider while slider is active keeps 'cursor' property as 'pointer'", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x+50, y+100))
      .run()
      .values;

    expect(slider.cursor).toBe("pointer");
  });

  test("When pointMove is called, value event fires even if the point location doesn't change", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x, y))
      .run()
      .values;

    throw new Error("Not implemented"); // TODO: check if event fires
  });
  
  test("When pointMove is called, value event fires even if the point location changes", () => {
    let { points: {ip}, sprites: {slider} } = template
      .feed(t => t.pointDown("ip", x, y).movePoint("ip", x+50, y))
      .run()
      .values;

    throw new Error("Not implemented"); // TODO: check if event fires
  });
});
