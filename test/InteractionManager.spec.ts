import { InteractionManager, IInteractionManager } from "../src/view/InteractionManager.ts";
import { AudioContext } from "web-audio-test-api";
import { Button } from "../src/view/Button";
import * as m from "../src/matrix"


// mock getContext function to quell an error caused by that not being there
// or smth
window.HTMLCanvasElement.prototype.getContext = () => {
  return {};
};

/**
 * Helper function: create a new IInteractionManager with a fresh audio context.
 */
const createInteractionManager = () : IInteractionManager => {
  const audioContext = new AudioContext();
  return new InteractionManager({audioContext});
}

/**
 * Helper function: create a button at 50,50.
 */
const createButton = (id: string, x : number, y: number) : Button => {
  const buttonPos = m.chain([1,0,0,1,0,0]).translate(x,y).value;
  
  // create button
  const button = new Button({
    id,
    position: buttonPos,
    source: null, // TODO: change?
    definition: null, // TODO: change?
  });
  return button;
}

/**
 * Helper function: create and add an interaction point to the interaction
 * manager, then return it.
 */
const addPointToInteractionManager = (im : IInteractionManager) : IInteractionPoint => {
  const ip = im.createInteractionPoint("pointName", "Touch");
  im.addPoint(ip);
  return ip;
};

describe("InteractionManager tests", () => {
  // const variables
  const x = 50;
  const y = 50;
  
  let im: InteractionManager = null;
  let button: Button = null;
  
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
    const point = im.createInteractionPoint("pointName", "Touch");
    
    expect(point.id).toBe("pointName");
    expect(point.type).toBe("Touch");
  });
  
  /**
   *
   * Simple test that the interaction manager manages to create an interaction
   * point with Touch type.
   */
  test("InteractionManager.createInteractionPoint() creates valid Mouse interaction point", () => {
    const point = im.createInteractionPoint("pointName", "Mouse");
    
    expect(point.id).toBe("pointName");
    expect(point.type).toBe("Mouse");
  });
  
  test("When calling InteractionManager.pointMove(), the hover flag for the moved interaction point is set", () => {
    const ip = addPointToInteractionManager(im);
    
    im.pointMove(ip, {clientX: x, clientY: y});
    
    expect(ip.hover.hover).toBe(true);
  });

  test("When calling InteractionManager.pointDown(), the button's 'active' flag is true", () => {
    const ip = addPointToInteractionManager(im);
    
    im.pointDown(ip, {clientX: x, clientY: y});

    expect(button.active).toBe(true);
  });

  test("When calling InteractionManager.pointDown(), the point's 'active' property is the button", () => {
    const ip = addPointToInteractionManager(im);
    
    im.pointDown(ip, {clientX: x, clientY: y});
    
    expect(ip.active).toBe(button);
  });

  test("When calling InteractionManager.pointDown(), the button's 'down' flag is true", () => {
    const ip = addPointToInteractionManager(im);
    
    im.pointDown(ip, {clientX: x, clientY: y});
    
    expect(button.down).toBe(true);
  });

  test("When calling InteractionManager.pointDown(), the point's 'down' flag is true", () => {
    const ip = addPointToInteractionManager(im);
    
    im.pointDown(ip, {clientX: x, clientY: y});
    
    expect(ip.down).toBe(true);
  });
  
  test("When calling InteractionManager.pointUp(), the point's 'down' flag is false", () => {
    const ip = addPointToInteractionManager(im);

    im.pointDown(ip, {clientX: x, clientY: y}); // ensure that "down" flag has previously been set
    im.pointUp(ip, {clientX: x, clientY: y});
    
    expect(ip.down).toBe(false);
  });

  test("When calling InteractionManager.pointUp(), the button's 'active' flag is false", () => {
    const ip = addPointToInteractionManager(im);

    im.pointDown(ip, {clientX: x, clientY: y}); // ensure that "active" flag has previously been set
    im.pointUp(ip, {clientX: x, clientY: y});

    expect(button.active).toBe(false);
  });

  test("When calling pointDown() and pointUp(), appropriate button events are fired", () => {
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();
    
    button.once("down",  callback); // emitted first on pointDown
    button.once("up",    callback); // emitted first on pointUp
    button.once("click", callback); // emitted second on pointUp
    
    im.pointDown(ip, {clientX: x, clientY: y});
    im.pointUp(ip, {clientX: x, clientY: y});

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, ip);
    expect(callback).toHaveBeenNthCalledWith(2, ip);
    expect(callback).toHaveBeenNthCalledWith(3, ip);
  });
  
  test("When calling pointDown() and pointUp(), appropriate interaction manager events are fired", () => {
    const ip = addPointToInteractionManager(im);
    const callback = jest.fn();
    
    im.once("firstdown",  callback); // emitted first on pointDown
    im.once("click",      callback); // emitted first on pointUp
    
    im.pointDown(ip, {clientX: x, clientY: y});
    im.pointUp(ip, {clientX: x, clientY: y});

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, ip);
    expect(callback).toHaveBeenNthCalledWith(2, ip);
  });

  test("When events are fired on overlapping buttons, only the button with the highest Z index gets clicked", () => {
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

    button.once("down",   callback1);
    button.once("up",     callback1);
    button.once("click",  callback1);
    button2.once("down",  callback2);
    button2.once("up",    callback2);
    button2.once("click", callback2);
    
    im.pointDown(ip, {clientX: x, clientY: y});
    im.pointUp(ip, {clientX: x, clientY: y});

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(3);
  });
});
