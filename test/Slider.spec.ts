import { Slider } from "../src/view/Slider";

import { setup } from "./setupUtil";

// TODO: Read up on slider implementation
// TODO: Review and update all the test names. Most probably don't make any
// sense atm.
describe("Slider tests", () => {
  test("Narrow phase collision TODO update description to better describe text", () => {
    throw new Error("Not implemented");
  });

  test("Hover over pill results in TODO figure out what it should do", () => {
    throw new Error("Not implemented");
  });

  test("Point down state results in TODO figure out what it should do", () => {
    throw new Error("Not implemented");
  });

  test("Point down state after moving it too far to the right", () => {
    throw new Error("Not implemented");
    // NOTE: should stop at end of slider
    // TEST: pill location ?
    // TEST: value ?
  });
  
  test("Point down state after moving it too far to the left", () => {
    throw new Error("Not implemented");
    // NOTE: should stop at start of slider
    // TEST: pill location ?
    // TEST: value ?
  });

  test("Point down state after moving it diagonally off the slider", () => {
    throw new Error("Not implemented");
    // NOTE: value should be at the projection of the mouse pointer onto the slider
  });

  test("Values when the slider changes", () => {
    throw new Error("Not implemented");
  });

  test("When value is changed, value event fires", () => {
    throw new Error("Not implemented");
  });
});
