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

// NOTE: What happens if pointDown is called repeatedly with no pointUp in
// between when slider is active? Does the slider become inactive if the user
// calls pointDown on the outside of the body, even if the point is already
// down?

// NOTE: I notice that some parts of the code uses "hasOwnProperty" to decide
// whether to set an optional property, while others use the || operator. Are
// there particular reasons to use one over the other, and would it be
// preferable to have the code refactored to consistently use one over the other
// if applicable?
// ^ not directly related to Slider behavior

// TODO: Read up on slider implementation
// TODO: Review and update all the test names. Most probably don't make any
// sense atm.
describe("Slider tests", () => {
  test("Hover over Slider body does not change pill location", () => {
    throw new Error("Not implemented");
  });
  
  test("Hover over Slider body does not change Slider value", () => {
    throw new Error("Not implemented");
  });
  
  test("Clicking outside Slider body does not change pill location", () => {
    throw new Error("Not implemented");
  });
  
  test("Clicking outside Slider body does not change Slider value", () => {
    throw new Error("Not implemented");
  });

  test("Clicking on Slider body changes pill location", () => {
    throw new Error("Not implemented");
  });
  
  test("Clicking on Slider body changes Slider value", () => {
    throw new Error("Not implemented");
  });

  test("Clicking on Slider body fires value change event", () => {
    throw new Error("Not implemented");
  });
  
  test("Hover over pill makes narrowPhase return pill", () =>  {
    throw new Error("Not implemented");
  });
  
  test("Point down on pill makes narrowPhase return pill", () =>  {
    throw new Error("Not implemented");
  });

  test("Hover over pill makes broadPhase return true", () => {
    throw new Error("Not implemented");
  })

  test("Hover over body makes broadPhase return true", () => {
    throw new Error("Not implemented");
  });

  test("Hover outside of body makes broadPhase return false", () => {
    throw new Error("Not implemented");
  });

  test("Hover outside of body makes narrowPhase return null", () => {
    throw new Error("Not implemented");
  });
  
  test("After point move narrowPhase still returns pill if Slider is active", () => {
    throw new Error("Not implemented");
  });

  test("After point move broadPhase still returns true if Slider is active", () => {
    throw new Error("Not implemented");
  });

  test("Activating Slider and then clicking outside of the body makes narrowPhase return null", () => {
    throw new Error("Not implemented");
  });

  test("Clicking on the Slider body but not on the pill makes broadPhase return true", () => {
    throw new Error("Not implemented");
  });
  
  test("Clicking on the Slider body but not on the pill makes narrowPhase return null", () => {
    throw new Error("Not implemented");
  });
  
  test("Activating the slider and moving the point beyond the start stops the pill at the start of the body", () => {
    throw new Error("Not implemented");
  });

  test("Activating the Slider and moving the point beyond the start stops the value at min", () => {
    throw new Error("Not implemented");
  });
  
  test("Activating the Slider and moving the point beyond the end stops the pill at the end of the body", () => {
    throw new Error("Not implemented");
  });

  test("Activating the Slider and moving the point beyond the end stops the value at max", () => {
    throw new Error("Not implemented");
  });

  test("Moving point off slider while slider is active projects value onto slider", () => {
    throw new Error("Not implemented");
  });

  test("When pointMove is called, value event fires even if the point location doesn't change", () => {
    throw new Error("Not implemented");
  });
  
  test("When pointMove is called, value event fires even if the point location changes", () => {
    throw new Error("Not implemented");
  });
});
