import { IValueChangeEvent } from "../src/events";
import { Cursor } from "../src/util";
import { ISlider } from "../src/view/Slider";
import { setup, TestSetup } from "./senpaiTestSetup";

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

  let template: TestSetup;
  beforeEach(() => {
    template = setup()
      .perform(t => t
        .addSlider("slider", x, y)
        .setTextures("slider", new Image(20, 20)) // set all textures to a 20x20 image
        .addInteractionPoint("ip", "Touch"))
      .placeholder()
      .perform(t => t.updateStage());
  });
  afterEach(() => {
    template.dispose();
  });

  test("Hover over Slider body makes broadPhase() return true",  () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x + 50, y)) // to the right of the pill by 30px
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;

    expect(slider.broadPhase(ip)).toBe(true);
  });

  test("Hover over pill makes broadPhase() return true",  () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x, y))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;

    expect(slider.broadPhase(ip)).toBe(true);
  });

  test("Hover over Slider body makes narrowPhase() return undefined",  () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x + 50, y)) // to the right of the pill by 30px
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    expect(slider.narrowPhase(ip)).toBe(undefined);
  });

  test("Hover over pill makes narrowPhase() return slider",  () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x, y))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;

    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("Hover over Slider body does not change 'cursor' property to 'pointer'", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x + 50, y)) // to the right of the pill by 30px
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    expect(stage.canvas.style.cursor).toBe("");
  });

  test("Hover over pill changes 'cursor' property to 'pointer'", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x, y))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    expect(slider.cursor).toBe("pointer");
  });

  test("Hover over Slider body does not change Slider value", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointMove("ip", x + 50, y))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;

    expect(slider.value).toBe(0);
  });

  /**
   * Reason for removal: Not prioritized
   *
   * test("Clicking outside Slider body does not change Slider value", () => {
   *  throw new Error("Not implemented");
   * });
   */

  test("Clicking on Slider body changes Slider value", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointDown("ip", x + 50, y))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    expect(slider.value).not.toBe(0);
  });

  test("Clicking on Slider body fires value change event", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t
          .addEventCallback("cb", "valueChangeEvent", "slider")
          .pointDown("ip", x + 50, y),
      )
      .run();
    const im = stage;
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    const cb = callbacks.cb;
    expect(cb).toBeCalledTimes(1);
    const expected: IValueChangeEvent<number> = {
      eventType: "ValueChange",
      previousValue: 0,
      property: "value",
      source: slider,
      stage: im,
      value: 0.5,
    };
    expect(cb.mock.calls[0][0]).toStrictEqual(expected);
  });

  test("Point down on pill makes narrowPhase return Slider", () =>  {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointDown("ip", x + 50, y))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("When point was just pressed down on body, narrowPhase returns Slider", () =>  {
    // setup without any action in the placeholder spot
    const { points, sprites } = template.feed(t => t).run();
    const { ip } = points;
    const { slider } = sprites;
    ip.firstDown = true; // this indicates that the point was just pressed down

    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("Hover outside of body makes broadPhase return false", () => {
    const { points, sprites } = template
      .feed(t => t.pointMove("ip", x + 200, y + 100))
      .run();
    const { ip } = points;
    const { slider } = sprites;
    expect(slider.broadPhase(ip)).toBe(false);
  });

  test("Hover outside of body makes narrowPhase return undefined", () => {
    const { points, sprites } = template
      .feed(t => t.pointMove("ip", x + 200, y + 100))
      .run();
    const { ip } = points;
    const { slider } = sprites;

    expect(slider.narrowPhase(ip)).toBe(undefined);
  });

  test("After point down and move narrowPhase still returns Slider", () => {
    const { points, sprites } = template
      .feed(t => t.pointDown("ip", x, y).pointMove("ip", x + 200, y + 100))
      .run();
    const { ip } = points;
    const { slider } = sprites;

    expect(slider.narrowPhase(ip)).toBe(slider);
  });

  test("After point down and move broadPhase still returns true", () => {
    const { points, sprites }  = template
      .feed(t => t.pointDown("ip", x, y).pointMove("ip", x + 200, y + 100))
      .run();

    const { ip } = points;
    const { slider } = sprites;
    expect(slider.broadPhase(ip)).toBe(true);
  });

  test("Activating the Slider and moving the point beyond the start stops the value at min", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointDown("ip", x, y).pointMove("ip", 0, y))
      .run();
    const slider =  sprites.slider as ISlider;
    expect(slider.value).toBe(slider.min);
  });

  test("Activating the Slider and moving the point beyond the end stops the value at max", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointDown("ip", x, y).pointMove("ip", x + 200, y))
      .run();

    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    expect(slider.value).toBe(slider.max);
  });

  test("Moving point off slider while slider is active projects value onto slider", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointDown("ip", x, y).pointMove("ip", x + 50, y + 100))
      .run();
    const ip = points.ip;
    const slider = sprites.slider as ISlider;

    expect(slider.value).toEqual(0.5);
  });

  test("Moving point off slider while slider is active keeps 'cursor' property as 'pointer'", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.pointDown("ip", x, y).pointMove("ip", x + 50, y + 100))
      .run();
    const slider = sprites.slider;
    expect(slider.cursor).toBe("pointer");
  });

  test("When pointMove is called, value event fires if the point location changes", () => {
    const { stage, sprites, points, callbacks } = template
      .feed(t => t.addButton("throwaway", 1000, 1000))
      .run();
    const im = stage;
    const ip = points.ip;
    const slider = sprites.slider as ISlider;
    const callback = jest.fn();
    slider.valueChangeEvent.listen(callback);
    const prevValue = slider.value;
    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);
    im.pointMove(ip, { clientX: x + 50, clientY: y } as MouseEvent | Touch);
    im.pointMove(ip, { clientX: x + 50, clientY: y } as MouseEvent | Touch);
    expect(callback).toBeCalledTimes(1);
    expect(prevValue)
      .toBeLessThan(callback.mock.calls[0][0].value);
  });
});
