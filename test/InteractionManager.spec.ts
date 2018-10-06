import { AudioContext } from "web-audio-test-api";
import { IPointClickEvent, IPointDownEvent, IPointUpEvent } from "../src/events";
import { copy, Identity } from "../src/matrix";
import { IInteractionPoint } from "../src/util";
import { Button, IButton } from "../src/view/Button";
import { IInteractionManager, InteractionManager } from "../src/view/InteractionManager";
import { setup, ITestSetupTemplate } from "./setupUtil";

describe("InteractionManager tests", () => {
  // const variables
  const x = 50;
  const y = 50;
  
  let stateTests: ITestSetupTemplate;


  // Setup before each test case: create an interaction manager.
  beforeEach(() => {
    stateTests = setup().template
      .perform(t => t) // TODO change as necessary
      .placeholder()
      .perform(t => t
        .updateStage()
        .renderStage()
      );
  });

  /**
   * Simple test that the interaction manager manages to create an interaction
   * point with Touch type.
   */
  test("InteractionManager.createInteractionPoint() creates valid Touch interaction point", () => {
    const { values } = stateTests.feed(t => t.addInteractionPoint("pointName")).run();
    const point = values.points.pointName as IInteractionPoint;

    expect(point.id).toBe("pointName");
    expect(point.type).toBe("Touch");
  });

  /**
   * Simple test that the interaction manager manages to create an interaction
   * point with Mouse type.
   * TODO: update setupUtil to work
   */
  test("InteractionManager.createInteractionPoint() creates valid Mouse interaction point", () => {

    const { values } = stateTests.feed(t => t).run();
    const point = values.stage.createInteractionPoint("pointName", "Mouse");

    expect(point.id).toBe("pointName");
    expect(point.type).toBe("Mouse");
  });

  test("When calling InteractionManager.pointMove() over a button, the hover flag for the moved interaction point is set", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .pointMove("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
  
    expect(ip.hover.hover).toBe(true);
  });
  
  test("When calling InteractionManager.pointMove() without a sprite underneath, the hover flag is falsy", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .pointMove("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
  
    expect(ip.hover).toBeFalsy();
  });

  test("When calling InteractionManager.pointDown(), the button's 'active' flag is true", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .pointDown("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;

    expect(button.active).toBe(true);
  });

  test("When calling InteractionManager.pointDown(), the point's 'active' property is the button", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .pointDown("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;

    expect(ip.active).toBe(button);
  });

  test("When calling InteractionManager.pointDown(), the button's 'down' flag is true", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .pointDown("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;

    expect(button.down).toBe(true);
  });

  test("When calling InteractionManager.pointDown(), the point's 'down' flag is true", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .pointDown("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;

    expect(ip.down).toBe(true);
  });

  test("When calling InteractionManager.pointUp(), the point's 'down' flag is false", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .pointDown("pointName", x, y)
      .pointUp("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
    
    expect(ip.down).toBe(false);
  });

  test("When calling InteractionManager.pointUp(), the button's 'active' flag is false", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .pointDown("pointName", x, y)
      .pointUp("pointName", x, y)).run();
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;

    expect(button.active).toBe(false);
  });

  test("When calling pointDown(), down button event is fired", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .addEventCallback("cb", "pointDownEvent", "button")
      .pointDown("pointName", x, y)).run();
    const im = values.stage;
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;
    const callback = values.callbacks.cb as jest.Mock;

    expect(callback).toHaveBeenCalledTimes(1);
    const expected: IPointDownEvent = {
      down: true,
      eventType: "PointDown",
      point: ip,
      previousX: 0,
      previousY: 0,
      source: button,
      stage: im,
      x,
      y,
    };
    expect(callback.mock.calls[0][0]).toStrictEqual(expected);
  });

  test("When repeatedly calling pointDown(), down button event is fired only once", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .addEventCallback("cb", "pointDownEvent", "button")
      .pointDown("pointName", x, y)
      .pointDown("pointName", x, y)).run();
    const callback = values.callbacks.cb as jest.Mock;

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("When calling pointDown() and pointUp(), up button event is fired", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .addEventCallback("cb", "pointUpEvent", "button")
      .pointDown("pointName", x, y)
      .pointUp("pointName", x, y)).run();
    const im = values.stage;
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;
    const callback = values.callbacks.cb as jest.Mock;

    expect(callback).toHaveBeenCalledTimes(1);

    const expected: IPointUpEvent = {
      down: false,
      eventType: "PointUp",
      point: ip,
      previousX: x,
      previousY: y,
      source: button,
      stage: im,
      x,
      y,
    };
    expect(callback.mock.calls[0][0]).toStrictEqual(expected);
  });

  test("When calling pointDown() and pointUp(), click button event is fired", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      .addEventCallback("cb", "pointClickEvent", "button")
      .pointDown("pointName", x, y)
      .pointUp("pointName", x, y)).run();
    const im = values.stage;
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;
    const callback = values.callbacks.cb as jest.Mock;

    expect(callback).toHaveBeenCalledTimes(1);
    const expected: IPointClickEvent = {
      down: false,
      eventType: "PointClick",
      point: ip,
      previousX: x,
      previousY: y,
      source: button,
      stage: im,
      x,
      y,
    };

    expect(callback.mock.calls[0][0]).toStrictEqual(expected);
  });

  // TODO: Check if this test does what it's supposed to
  test("When calling pointDown(), firstdown interaction manager event is fired", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      // There should be a way to specify "add callback to stage"
      .addEventCallback("cb", "pointDownEvent", "button")
      .pointDown("pointName", x, y)).run();
    const im = values.stage;
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;
    const callback = values.callbacks.cb as jest.Mock;
    
    const expected: IPointDownEvent = {
      down: true,
      eventType: "PointDown",
      point: ip,
      previousX: 0,
      previousY: 0,
      source: button,
      stage: im,
      x,
      y,
    };
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toStrictEqual(expected);
  });

  test("When calling pointDown() and pointUp(), click interaction manager event is fired", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button", x, y)
      // There should be a way to specify "add callback to stage"
      .addEventCallback("cb", "pointDownEvent", "button")
      .pointDown("pointName", x, y)).run();
    const im = values.stage;
    const ip = values.points.pointName as IInteractionPoint;
    const button = values.sprites.button as IButton;
    const callback = values.callbacks.cb as jest.Mock;
    
    const expected: IPointUpEvent = {
      down: false,
      eventType: "PointUp",
      point: ip,
      previousX: 0,
      previousY: 0,
      source: im,
      stage: im,
      x: 0,
      y: 0,
    };
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toStrictEqual(expected);
  });

  test("When buttons overlap, the 'down' event is captured by the button with the highest z level", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button1", x, y)
      .addButton("button2", x, y)
      // TODO: set Z level
      .addEventCallback("cb1", "pointDownEvent", "button1")
      .addEventCallback("cb1", "pointDownEvent", "button2")
      .pointDown("pointName", x, y)).run();
    const callback1 = values.callbacks.cb1 as jest.Mock;
    const callback2 = values.callbacks.cb2 as jest.Mock;

    // set z indices - since button2 has a higher z index, it should be clicked
    // while the original button should not be
    //button.setZ(0);
    //button2.setZ(1);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test("When buttons overlap, the 'up' event is captured by the button with the highest z level", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button1", x, y)
      .addButton("button2", x, y)
      // TODO: set Z level
      .addEventCallback("cb1", "pointUpEvent", "button1")
      .addEventCallback("cb2", "pointUpEvent", "button2")
      .pointDown("pointName", x, y)
      .pointUp("pointName", x, y)).run();
    const callback1 = values.callbacks.cb1 as jest.Mock;
    const callback2 = values.callbacks.cb2 as jest.Mock;
    // set z indices - since button2 has a higher z index, it should be clicked
    // while the original button should not be
    //button.setZ(0);
    //button2.setZ(1);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test("When buttons overlap, the 'click' event is captured by the button with the highest z level", () => {
    const { values } = stateTests.feed(t => t
      .addInteractionPoint("pointName")
      .addButton("button1", x, y)
      .addButton("button2", x, y)
      // TODO: set Z level
      .addEventCallback("cb1", "pointClickEvent", "button1")
      .addEventCallback("cb2", "pointClickEvent", "button2")
      .pointDown("pointName", x, y)
      .pointUp("pointName", x, y)).run();
    const callback1 = values.callbacks.cb1 as jest.Mock;
    const callback2 = values.callbacks.cb2 as jest.Mock;
    
    // set z indices - since button2 has a higher z index, it should be clicked
    // while the original button should not be
    //button.setZ(0);
    //button2.setZ(1);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  // TODO: ensure that when pointDown or pointUp is called repeatedly (twice),
  // the event is still only fired once
});
