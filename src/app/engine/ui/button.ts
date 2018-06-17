import { SpriteSheet } from "../textures/sprite-texture";
import { Rectangle } from "../game-objects/rectangle";
import { IRenderable, Renderer } from "../rendering/renderer";
import { ImageTexture } from "../textures/image-texture";
import { MouseInput, MouseInputEvent } from "../input/mouse-input";
import { CollisionDetector } from "../detectors/collision-detector";

export type ButtonEventName = "click" | "mouseover"  | "mouseout" | "mousemove";

export interface IButtonOptions {
    width: number;
    height: number;
    x: number;
    y: number;
    texture: ImageTexture|SpriteSheet;
}

export class Button implements IRenderable {

    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public fixedPosition = false;

    private shape: Rectangle;
    private visible: boolean = false;
    private mousedOver: boolean = false;

    private eventHandlers: {
        "click": Function[];
        "mouseover": Function[];
        "mouseout": Function[];
        "mousemove": Function[];
    };

    private boundOnClick: (evt: MouseInputEvent) => void;
    private boundOnMouseOut: (evt: MouseInputEvent) => void;
    private boundOnMouseMove: (evt: MouseInputEvent) => void;

    constructor(options: IButtonOptions, private mouseInput: MouseInput, private renderer: Renderer) {
        this.width = options.width;
        this.height = options.height;
        this.x = options.x;
        this.y = options.y;

        this.shape = new Rectangle(this.width, this.height, this.x, this.y);
        if (options.texture instanceof ImageTexture) {
            this.shape.imageTexture = options.texture;
        } else if (options.texture instanceof SpriteSheet) {
            this.shape.spriteSheet = options.texture;
        }
        this.show();
    }

    public show() {
        if (this.visible) {
            return;
        }
        this.visible = true;
        this.renderer.addObject(this);
        this.bindEventHandlers();
    }

    public hide() {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        this.renderer.removeObject(this);
        this.unbindEventHandlers();
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
    }

    public on(eventName: ButtonEventName, handler: () => void) {
        this.eventHandlers[eventName].push(handler);
    }

    private triggerEventHandlers(eventName: ButtonEventName, evtObj: any) {
        if (this.eventHandlers[eventName].length === 0) {
            return;
        }
        for (const handler of this.eventHandlers[eventName]) {
            handler(evtObj);
        }
    }

    private bindEventHandlers() {
        this.eventHandlers = {
            "click": [],
            "mouseover": [],
            "mouseout": [],
            "mousemove": []
        };

        this.boundOnClick = this.onClick.bind(this);
        this.boundOnMouseMove = this.onMouseMove.bind(this);
        this.boundOnMouseOut = this.onMouseOut.bind(this);
        
        this.mouseInput.on("click", this.boundOnClick);
        this.mouseInput.on("mousemove", this.boundOnMouseMove);
        this.mouseInput.on("mouseout", this.boundOnMouseOut);
    }

    private onClick(evt: MouseInputEvent) {
        const mouse = {
            x: evt.event.offsetX,
            y: evt.event.offsetY,
            width: 5,
            height: 5
        }
        if (!CollisionDetector.hasCollision(mouse, this)) {
            return;
        }
        this.triggerEventHandlers("click", evt);
    }

    private onMouseMove(evt: MouseInputEvent) {
        const mouse = {
            x: evt.event.offsetX,
            y: evt.event.offsetY,
            width: 5,
            height: 5
        }
        if (this.mousedOver && !CollisionDetector.hasCollision(mouse, this)) {
            this.mousedOver = false;
            this.triggerEventHandlers("mouseout", evt);
        }
        if (!CollisionDetector.hasCollision(mouse, this)) {
            return;
        }

        this.mousedOver = true;
        this.triggerEventHandlers("mouseover", evt);
    }

    private onMouseOut(evt: MouseInputEvent) {
        this.triggerEventHandlers("mouseout", evt);
    }

    private unbindEventHandlers() {
        this.mouseInput.unbind("click", this.boundOnClick);
        this.mouseInput.unbind("mousemove", this.boundOnMouseMove);
        this.mouseInput.unbind("mouseout", this.boundOnMouseOut);
    }

}