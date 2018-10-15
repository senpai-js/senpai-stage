import {
  EventEmitter,
  IKeyDownEvent,
  IKeyPressEvent,
  IKeyUpEvent,
  IMouseDownEvent,
  IMouseMoveEvent,
  IMouseUpEvent,
  IPointDownEvent,
  IPointMoveEvent,
  IPointUpEvent,
  ITouchCancelEvent,
  ITouchEndEvent,
  ITouchMoveEvent,
  ITouchStartEvent,
} from "../events";
import { IInteractionPoint, IKeyable, SpriteType, zSort } from "../util";
import { Container, IContainer, IContainerProps } from "./Container";
import { IPanel } from "./Panel";
import { ISprite, Sprite } from "./Sprite";

interface IInteractionPointIndex {
  [id: number]: IInteractionPoint;
}

interface IKeyIndex {
  [key: string]: boolean;
}

export interface IInteractionManager extends IContainer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mousePoint: IInteractionPoint;
  touchPointIndex: IInteractionPointIndex;
  keyIndex: IKeyIndex;
  insertMode: boolean;

  pointDownEvent: EventEmitter<IPointDownEvent>;
  pointUpEvent: EventEmitter<IPointUpEvent>;
  pointMoveEvent: EventEmitter<IPointMoveEvent>;

  mouseDownEvent: EventEmitter<IMouseDownEvent>;
  mouseUpEvent: EventEmitter<IMouseUpEvent>;
  mouseMoveEvent: EventEmitter<IMouseMoveEvent>;

  touchCancelEvent: EventEmitter<ITouchCancelEvent>;
  touchEndEvent: EventEmitter<ITouchEndEvent>;
  touchMoveEvent: EventEmitter<ITouchMoveEvent>;
  touchStartEvent: EventEmitter<ITouchStartEvent>;

  keyDownEvent: EventEmitter<IKeyDownEvent>;
  keyUpEvent: EventEmitter<IKeyUpEvent>;
  keyPressEvent: EventEmitter<IKeyPressEvent>;

  hookEvents(): void;
  dispose(): void;
  createInteractionPoint(id: string, type: "Touch" | "Mouse"): IInteractionPoint;
  addTouchPoint(touch: Touch): IInteractionPoint;
  removeTouchPoint(touch: Touch): void;
  pointDown(point: IInteractionPoint, position: Touch | MouseEvent): void;
  pointUp(point: IInteractionPoint, position: Touch | MouseEvent): void;
  pointMove(point: IInteractionPoint, position: Touch | MouseEvent): void;
  pointCancel(point: IInteractionPoint, position: Touch | MouseEvent): void;

  // high level events
  mouseDown(event: MouseEvent): void;
  mouseUp(event: MouseEvent): void;
  mouseMove(event: MouseEvent): void;
  touchStart(event: TouchEvent): void;
  touchEnd(event: TouchEvent): void;
  touchMove(event: TouchEvent): void;
  touchCancel(event: TouchEvent): void;

  keyDown(event: KeyboardEvent | IKeyable): void;
  keyUp(event: KeyboardEvent | IKeyable): void;
  keyPress(event: KeyboardEvent | IKeyable): void;

  setFocus(target: ISprite): void;
  getFocusedSprite(): void;
}

interface IInteractionPointEvent {
  target: HTMLElement | Window;
  event: string;
  listener: (e: MouseEvent | TouchEvent) => void;
}
interface IKeyboardEvent {
  target: HTMLElement | Window;
  event: string;
  listener: (e: KeyboardEvent) => void;
}

export interface IInteractionManagerProps extends IContainerProps {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export class InteractionManager extends Container implements IInteractionManager {
  public canvas: HTMLCanvasElement = null;
  public ctx: CanvasRenderingContext2D = null;
  public touchPointIndex: IInteractionPointIndex = {};
  public keyIndex: IKeyIndex = {};
  public mousePoint: IInteractionPoint = {
    active: null,
    captured: false,
    clicked: false,
    down: false,
    firstDown: false,
    hover: null,
    id: "mouse",
    tx: 0,
    ty: 0,
    type: "Mouse",
    x: 0,
    y: 0,
  };
  public insertMode: boolean = false;

  public pointDownEvent: EventEmitter<IPointDownEvent> = new EventEmitter<IPointDownEvent>();
  public pointUpEvent: EventEmitter<IPointUpEvent> = new EventEmitter<IPointUpEvent>();
  public pointMoveEvent: EventEmitter<IPointMoveEvent> = new EventEmitter<IPointMoveEvent>();

  public mouseDownEvent: EventEmitter<IMouseDownEvent> = new EventEmitter<IMouseDownEvent>();
  public mouseUpEvent: EventEmitter<IMouseUpEvent> = new EventEmitter<IMouseUpEvent>();
  public mouseMoveEvent: EventEmitter<IMouseMoveEvent> = new EventEmitter<IMouseMoveEvent>();

  public touchCancelEvent: EventEmitter<ITouchCancelEvent> = new EventEmitter<ITouchCancelEvent>();
  public touchEndEvent: EventEmitter<ITouchEndEvent> = new EventEmitter<ITouchEndEvent>();
  public touchMoveEvent: EventEmitter<ITouchMoveEvent> = new EventEmitter<ITouchMoveEvent>();
  public touchStartEvent: EventEmitter<ITouchStartEvent> = new EventEmitter<ITouchStartEvent>();

  public keyDownEvent: EventEmitter<IKeyDownEvent> = new EventEmitter<IKeyDownEvent>();
  public keyUpEvent: EventEmitter<IKeyUpEvent> = new EventEmitter<IKeyUpEvent>();
  public keyPressEvent: EventEmitter<IKeyPressEvent> = new EventEmitter<IKeyPressEvent>();

  private events: IInteractionPointEvent[] = [
    { target: null, event: "mousedown", listener: e => this.mouseDown(e as MouseEvent) },
    { target: window, event: "mouseup", listener: e => this.mouseUp(e as MouseEvent) },
    { target: null, event: "mousemove", listener: e => this.mouseMove(e as MouseEvent) },
    { target: null, event: "touchstart", listener: e => this.touchStart(e as TouchEvent) },
    { target: window, event: "touchend", listener: e => this.touchEnd(e as TouchEvent) },
    { target: null, event: "touchmove", listener: e => this.touchMove(e as TouchEvent) },
    { target: window, event: "touchcancel", listener: e => this.touchCancel(e as TouchEvent) },
  ];
  private keyboardEvents: IKeyboardEvent[] = [
    { target: window, event: "keydown", listener: e => this.keyDown(e as KeyboardEvent) },
    { target: window, event: "keypress", listener: e => this.keyPress(e as KeyboardEvent) },
    { target: window, event: "keyup", listener: e => this.keyUp(e as KeyboardEvent) },
  ];

  constructor(props: IInteractionManagerProps) {
    super(props);
    this.canvas = props.canvas;
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      document.body.appendChild(this.canvas);
    }
    this.canvas.width = props.width;
    this.canvas.height = props.height;
    this.ctx = this.canvas.getContext("2d");
    this.hookEvents();
    this.addPoint(this.mousePoint);
  }

  public hookEvents(): void {
    this.events.forEach(
      event => (event.target || this.canvas)
        .addEventListener(event.event, event.listener),
    );
    this.keyboardEvents.forEach(
      event => (event.target || this.canvas)
        .addEventListener(event.event, event.listener),
    );
  }

  public dispose(): void {
    this.events.forEach(
      event => (event.target || this.canvas)
        .removeEventListener(event.event, event.listener),
    );
  }

  public mouseDown(event: MouseEvent): void {
    this.mouseDownEvent.emit({
      down: true,
      eventType: "MouseDown",
      rawEvent: event,
      source: this,
      stage: this,
      x: event.clientX,
      y: event.clientY,
    });
    return this.pointDown(this.mousePoint, event);
  }

  public mouseUp(event: MouseEvent): void {
    this.mouseUpEvent.emit({
      down: false,
      eventType: "MouseUp",
      rawEvent: event,
      source: this,
      stage: this,
      x: event.clientX,
      y: event.clientY,
    });
    return this.pointUp(this.mousePoint, event);
  }

  public mouseMove(event: MouseEvent): void {
    this.mouseMoveEvent.emit({
      down: this.mousePoint.down,
      eventType: "MouseMove",
      rawEvent: event,
      source: this,
      stage: this,
      x: event.clientX,
      y: event.clientY,
    });

    return this.pointMove(this.mousePoint, event);
  }

  public touchStart(event: TouchEvent): void {
    let touch: Touch;
    let point: IInteractionPoint;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.changedTouches.length; i++) {
      touch = event.changedTouches[i];
      this.touchStartEvent.emit({
        down: true,
        eventType: "TouchStart",
        rawEvent: event,
        source: this,
        stage: this,
        touch,
        x: touch.clientX,
        y: touch.clientY,
      });
      point = this.addTouchPoint(touch);
      this.pointDown(point, touch);
    }
  }

  public touchEnd(event: TouchEvent): void {
    let touch: Touch = null;
    let point: IInteractionPoint;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.changedTouches.length; i++) {
      touch = event.changedTouches[i];
      this.touchEndEvent.emit({
        down: false,
        eventType: "TouchEnd",
        rawEvent: event,
        source: this,
        stage: this,
        touch,
        x: touch.clientX,
        y: touch.clientY,
      });

      if (!this.touchPointIndex[touch.identifier]) {
        point = this.createInteractionPoint(touch.identifier.toString(), "Touch");
        this.pointMove(point, touch);
      } else {
        point = this.touchPointIndex[touch.identifier];
        this.pointUp(point, touch);
        this.removeTouchPoint(touch);
      }
    }
  }

  public touchCancel(event: TouchEvent): void {
    let touch: Touch = null;
    let point: IInteractionPoint;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.changedTouches.length; i++) {
      touch = event.changedTouches[i];
      this.touchCancelEvent.emit({
        down: false,
        eventType: "TouchCancel",
        rawEvent: event,
        source: this,
        stage: this,
        touch,
        x: null,
        y: null,
      });
      if (this.touchPointIndex[touch.identifier]) {
        point = this.touchPointIndex[touch.identifier];
        this.pointCancel(point, touch);
        this.removeTouchPoint(touch);
      }
    }
  }

  public touchMove(event: TouchEvent): void {
    let touch: Touch = null;
    let point: IInteractionPoint;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.changedTouches.length; i++) {
      touch = event.changedTouches[i];
      this.touchMoveEvent.emit({
        down: true,
        eventType: "TouchMove",
        rawEvent: event,
        source: this,
        stage: this,
        touch,
        x: touch.clientX,
        y: touch.clientY,
      });
      if (!this.touchPointIndex[touch.identifier]) {
        point = this.addTouchPoint(touch);
        point.down = true;
      } else {
        point = this.touchPointIndex[touch.identifier];
      }
      this.pointMove(point, touch);
    }
  }
  public pointDown(point: IInteractionPoint, position: Touch | MouseEvent): void {
    const alreadyDown = point.down;
    if (!alreadyDown) {
      point.down = true;
      point.firstDown = true;
    }
    const previousX = point.x;
    const previousY = point.y;
    this.pointMove(point, position);
    if (alreadyDown) {
      return;
    }
    if (point.hover) {
      point.active = point.hover;
      point.active.down = true;
      point.active.active = true;
      this.setFocus(point.hover);
      point.active.pointDownEvent.emit({
        down: true,
        eventType: "PointDown",
        point,
        previousX,
        previousY,
        source: point.active,
        stage: this,
        x: point.x,
        y: point.y,
      });
    } else {
      this.setFocus(null);
    }
    this.pointDownEvent.emit({
      down: true,
      eventType: "PointDown",
      point,
      previousX,
      previousY,
      source: point.active,
      stage: this,
      x: point.x,
      y: point.y,
    });
    point.firstDown = false; // after this point, the point will not be considered "just recently pressed"
  }

  public pointUp(point: IInteractionPoint, position: Touch | MouseEvent): void {
    const previousX = point.x;
    const previousY = point.y;
    let source: ISprite = null;
    this.pointMove(point, position);
    if (!point.down) {
      return;
    }
    point.down = false;
    if (point.active) {
      point.active.down = false;
      point.active.active = false;
      point.active.pointUpEvent.emit({
        down: false,
        eventType: "PointUp",
        point,
        previousX,
        previousY,
        source: point.active,
        stage: this,
        x: point.x,
        y: point.x,
      });

      if (point.hover === point.active) {
        point.active.pointClick(point);
        point.active.pointClickEvent.emit({
          down: false,
          eventType: "PointClick",
          point,
          previousX,
          previousY,
          source: point.active,
          stage: this,
          x: point.x,
          y: point.x,
        });
      }
      source = point.active;
      point.active = null;
    }

    this.pointUpEvent.emit({
      down: false,
      eventType: "PointUp",
      point,
      previousX,
      previousY,
      source: source || this,
      stage: this,
      x: point.x,
      y: point.x,
    });
}

  public pointMove(point: IInteractionPoint, position: Touch | MouseEvent): void {
    const now = Date.now();
    const rect = this.canvas.getBoundingClientRect();
    const previousX = point.x;
    const previousY = point.y;
    point.x = position.clientX - rect.left;
    point.y = position.clientY - rect.top;

    if (point.hover) {
      point.hover.hover = false;
      point.hover = null;
    }
    // sprites sorted by ascending z level
    // REASON: Higher z levels are drawn last, so forward-iterating through the
    // array and drawing the sprites will yield the correct result.
    this.sprites.sort(zSort);

    // find the highest z level sprite the point collides with
    // loop is reversed due to z levels being sorted ascendingly
    let sprite: ISprite;
    let hoveringSprite: ISprite;
    for (let i = this.sprites.length - 1; i >= 0; i--) {
      sprite = this.sprites[i];
      hoveringSprite = sprite.isHovering(point, now);

      if (hoveringSprite) {
        hoveringSprite.hover = true;
        point.hover = hoveringSprite; // this can later be used by pointDown and pointUp
        hoveringSprite.pointCollision(point);
        hoveringSprite.pointMoveEvent.emit({
          down: point.down,
          eventType: "PointMove",
          point,
          previousX,
          previousY,
          source: sprite,
          stage: this,
          x: point.x,
          y: point.y,
        });
        break; // we've found the highest z level sprite the point collides with
      }
    }
    this.pointMoveEvent.emit({
      down: point.down,
      eventType: "PointMove",
      point,
      previousX,
      previousY,
      source: sprite,
      stage: this,
      x: point.x,
      y: point.y,
    });
  }

  public pointCancel(point: IInteractionPoint, position: Touch | MouseEvent): void {
    if (point.active) {
      point.active.active = false;
      point.active = null;
    }
    if (point.hover) {
      point.hover.hover = false;
      point.hover = null;
    }
  }

  public createInteractionPoint(id: string, type: "Touch" | "Mouse"): IInteractionPoint {
    const point: IInteractionPoint = {
      active: null,
      captured: false,
      clicked: false,
      down: false,
      firstDown: false,
      hover: null,
      id,
      tx: 0,
      ty: 0,
      type,
      x: 0,
      y: 0,
    };

    return point;
  }

  public addTouchPoint(touch: Touch): IInteractionPoint {
    const point = this.createInteractionPoint(touch.identifier.toString(), "Touch");
    this.addPoint(point);
    this.touchPointIndex[touch.identifier] = point;
    return point;
  }

  public removeTouchPoint(touch: Touch): void {
    const point: IInteractionPoint = this.touchPointIndex[touch.identifier];
    delete this.touchPointIndex[touch.identifier];
    this.removePoint(point);
  }

  public hoverCheck(now: number): void {
    let point: IInteractionPoint;
    let sprite: ISprite;
    this.sprites.sort(zSort);

    for (point of this.points) {
      if (point.hover) {
        point.hover.hover = false;
        point.hover = null;
      }

      for (let i = this.sprites.length - 1; i >= 0; i--) {
        sprite = this.sprites[i];
        const hoveringSprite = sprite.isHovering(point, now);
        if (hoveringSprite) {
          hoveringSprite.pointCollision(point);
          point.hover = hoveringSprite;
          hoveringSprite.hover = true;
          break;
        }
      }
    }
  }

  public keyUp(e: KeyboardEvent | IKeyable): void {
    this.keyIndex[e.key] = false;
    const focusedSprite: ISprite = this.getFocusedSprite();
    if (focusedSprite) {
      focusedSprite.keyUp({
        alt: e.altKey,
        ctrl: e.ctrlKey,
        down: false,
        eventType: "KeyUp",
        key: e.key,
        shift: e.shiftKey,
        source: focusedSprite,
        stage: this,
      });
    }
    this.keyUpEvent.emit({
      alt: e.altKey,
      ctrl: e.ctrlKey,
      down: false,
      eventType: "KeyUp",
      key: e.key,
      shift: e.shiftKey,
      source: focusedSprite || this,
      stage: this,
    });
  }

  public keyDown(e: KeyboardEvent | IKeyable): void {
    this.keyIndex[e.key] = false;
    if (e.key === "Insert") {
      this.insertMode = !this.insertMode;
    }
    const focusedSprite: ISprite = this.getFocusedSprite();
    if (focusedSprite) {
      focusedSprite.keyDown({
        alt: e.altKey,
        ctrl: e.ctrlKey,
        down: true,
        eventType: "KeyDown",
        key: e.key,
        shift: e.shiftKey,
        source: focusedSprite,
        stage: this,
      });
    }
    this.keyDownEvent.emit({
      alt: e.altKey,
      ctrl: e.ctrlKey,
      down: true,
      eventType: "KeyDown",
      key: e.key,
      shift: e.shiftKey,
      source: focusedSprite || this,
      stage: this,
    });
  }

  public keyPress(e: KeyboardEvent | IKeyable): void {
    const focusedSprite: ISprite = this.getFocusedSprite();
    if (focusedSprite) {
      focusedSprite.keyPress({
        alt: e.altKey,
        ctrl: e.ctrlKey,
        down: true,
        eventType: "KeyPress",
        key: e.key,
        shift: e.shiftKey,
        source: focusedSprite,
        stage: this,
      });
    }
    this.keyPressEvent.emit({
      alt: e.altKey,
      ctrl: e.ctrlKey,
      down: true,
      eventType: "KeyPress",
      key: e.key,
      shift: e.shiftKey,
      source: focusedSprite || this,
      stage: this,
    });
  }

  public setFocus(target: ISprite): void {
    for (const sprite of this.sprites) {
      sprite.focused = sprite === target;
      if (sprite.type === SpriteType.Panel) {
        const panel = sprite as IPanel;
        panel.focus(target);
      }
    }
  }

  public getFocusedSprite(): ISprite {
    for (const sprite of this.sprites) {
      const s: ISprite = sprite.isFocused();
      if (s) {
        return s;
      }
    }
  }
}
