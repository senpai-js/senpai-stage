import { AudioContext } from "web-audio-test-api";
import { IPointClickEvent, IPointDownEvent, IPointUpEvent } from "../src/events";
import { copy, Identity } from "../src/matrix";
import { IInteractionPoint, IKeyable } from "../src/util";
import { Button, IButton } from "../src/view/Button";
import { IInteractionManager, InteractionManager } from "../src/view/InteractionManager";
import { setup, TestSetup } from "./senpaiTestSetup";

/**
 * Helper function: create a new IInteractionManager with a fresh audio context.
 */
const createInteractionManager = (): IInteractionManager => {
  const audioContext = new AudioContext();
  const canvas = document.createElement("canvas");
  return new InteractionManager({
    audioContext,
    canvas,
    height: 600,
    width: 800,
  });
};

/**
 * Helper function: create a button at 50,50.
 */
const createButton = (id: string, x: number, y: number): Button => {
  const buttonPos = copy(Identity).translate(x, y).value;

  // create button
  const button = new Button({
    definition: null, // TODO: change?
    id,
    position: buttonPos,
    source: null, // TODO: change?
  });
  return button;
};

/**
 * Helper function: create and add an interaction point to the interaction
 * manager, then return it.
 */
const addPointToInteractionManager = (im: IInteractionManager): IInteractionPoint => {
  const ip = im.createInteractionPoint("pointName", "Touch");
  im.addPoint(ip);
  return ip;
};

describe("InteractionManager tests", () => {
  // const variables
  const x = 50;
  const y = 50;

  let im: IInteractionManager = null;
  let button: IButton = null;

  // Setup before each test case: create an interaction manager.
  beforeEach(() => {
    im = createInteractionManager();

    button = createButton("button", x, y);
    im.addSprite(button);
  });

  // this is probably not necessary, but added for good measure
  afterEach(() => {
    im = null;
    button = null;
  });

  /**
   * Simple test that the interaction manager manages to create an interaction
   * point with Touch type.
   */
  test("InteractionManager.createInteractionPoint() creates valid Touch interaction point", () => {
    const { points } = setup()
      .addInteractionPoint("pointName", "Touch");
    const point = points.pointName as IInteractionPoint;

    expect(point.id).toBe("pointName");
    expect(point.type).toBe("Touch");
  });

  /**
   * Simple test that the interaction manager manages to create an interaction
   * point with Mouse type.
   */
  test("InteractionManager.createInteractionPoint() creates valid Mouse interaction point", () => {
    const { points } = setup().addInteractionPoint("pointName", "Mouse");
    const point = points.pointName as IInteractionPoint;

    expect(point.id).toBe("pointName");
    expect(point.type).toBe("Mouse");
  });

  test("When calling pointDown(), down button event is fired", () => {
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();

    button.pointDownEvent.once(callback); // emitted first on pointDown

    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);

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
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();

    button.pointDownEvent.listen(callback); // emitted first on pointDown

    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);
    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("When calling pointDown() and pointUp(), up button event is fired", () => {
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();

    button.pointUpEvent.listen(callback); // emitted first on pointDown

    im.pointDown(ip, {clientX: x, clientY: y} as MouseEvent | Touch);
    im.pointUp(ip, {clientX: x, clientY: y} as MouseEvent | Touch);

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
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();

    button.pointClickEvent.listen(callback); // emitted first on pointDown

    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);
    im.pointUp(ip, { clientX: x, clientY: y } as MouseEvent | Touch);

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

  test("When calling pointDown(), firstdown interaction manager event is fired", () => {
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();

    im.pointDownEvent.listen(callback); // emitted first on pointDown

    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);
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
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();

    im.pointUpEvent.once(callback); // emmitted the moment the point goes up
    im.pointDown(ip, { clientX: 0, clientY: 0 } as MouseEvent | Touch);
    im.pointUp(ip, { clientX: 0, clientY: 0 } as MouseEvent | Touch);
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
    const ip = addPointToInteractionManager(im);
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    // add a second button
    const button2 = createButton("button2", x, y);
    im.addSprite(button2);

    // set z indices - since button2 has a higher z index, it should be clicked
    // while the original button should not be
    button.setZ(0);
    button2.setZ(1);

    button.pointDownEvent.once(callback1);
    button2.pointDownEvent.once(callback2);

    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test("When buttons overlap, the 'up' event is captured by the button with the highest z level", () => {
    const ip = addPointToInteractionManager(im);
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    // add a second button
    const button2 = createButton("button2", x, y);
    im.addSprite(button2);

    // set z indices - since button2 has a higher z index, it should be clicked
    // while the original button should not be
    button.setZ(0);
    button2.setZ(1);

    button.pointUpEvent.once(callback1);
    button2.pointUpEvent.once(callback2);

    im.pointDown(ip, {clientX: x, clientY: y} as MouseEvent | Touch);
    im.pointUp(ip, {clientX: x, clientY: y} as MouseEvent | Touch);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test("When buttons overlap, the 'click' event is captured by the button with the highest z level", () => {
    const ip = addPointToInteractionManager(im);
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    // add a second button
    const button2 = createButton("button2", x, y);
    im.addSprite(button2);

    // set z indices - since button2 has a higher z index, it should be clicked
    // while the original button should not be
    button.setZ(0);
    button2.setZ(1);

    button.pointClickEvent.once(callback1);
    button2.pointClickEvent.once(callback2);

    im.pointDown(ip, { clientX: x, clientY: y } as MouseEvent | Touch);
    im.pointUp(ip, { clientX: x, clientY: y } as MouseEvent | Touch);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test("repeated calls to point down call pointDown once", () => {
    const ip = addPointToInteractionManager(im);
    const fn = jest.fn();
    im.pointDownEvent.listen(fn);
    const point: any = {
      clientX: 10,
      clientY: 10,
    };
    im.pointDown(ip, point);
    im.pointDown(ip, point);
    expect(fn).toBeCalledTimes(1);
  });

  test("repeated calls to point up call pointUp once", () => {
    const ip = addPointToInteractionManager(im);
    const fn = jest.fn();
    im.pointUpEvent.listen(fn);
    const point: any = {
      clientX: 10,
      clientY: 10,
    };
    im.pointDown(ip, point);
    im.pointUp(ip, point);
    im.pointUp(ip, point);
    expect(fn).toBeCalledTimes(1);
  });

  test("Pressing the Insert button on the keyboard toggles the insertMode to false", () => {
    im.insertMode = true;
    im.keyDown({key: "Insert", altKey: false, ctrlKey: false, shiftKey: false} as KeyboardEvent | IKeyable);

    expect(im.insertMode).toBe(false);
  });

  test("Pressing the Insert button on the keyboard toggles the insertMode to true", () => {
    im.insertMode = false;
    im.keyDown({key: "Insert", altKey: false, ctrlKey: false, shiftKey: false} as KeyboardEvent | IKeyable);

    expect(im.insertMode).toBe(true);
  });

  test("calling setFocus on sprite sets the focused property", () => {
    im.setFocus(button);
    expect(button.focused).toBeTruthy();
  });

});
