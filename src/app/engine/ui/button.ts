import { SpriteSheet } from "../textures/sprite-texture";
import { Rectangle } from "../game-objects/rectangle";
import { IRenderable, Renderer } from "../rendering/renderer";
import { ImageTexture } from "../textures/image-texture";
import { MouseInput } from "../input/mouse-input";
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

    private shape: Rectangle;

    private eventHandlers: {
        "click": Function[];
        "mouseover": Function[];
        "mouseout": Function[];
        "mousemove": Function[];
    };

    constructor(options: IButtonOptions, private mouseInput: MouseInput) {
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
        this.bindEventHandlers();
    }

    public beforeRender() {

    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
    }

    public afterRender() {

    }

    public on(eventName: ButtonEventName, handler: () => void) {
        this.eventHandlers[eventName].push(handler);
    }

    private bindEventHandlers() {
        this.eventHandlers = {
            "click": [],
            "mouseover": [],
            "mouseout": [],
            "mousemove": []
        };
        const triggerEventHandlers = (eventName: ButtonEventName, evtObj: any) => {
            if (this.eventHandlers[eventName].length === 0) {
                return;
            }
            for (const handler of this.eventHandlers[eventName]) {
                handler(evtObj);
            }
        }

        this.mouseInput.onClick(evt => {
            const mouse = {
                x: evt.event.x,
                y: evt.event.y,
                width: 5,
                height: 5
            }
            if (!CollisionDetector.hasCollision(mouse, this)) {
                return;
            }
            triggerEventHandlers("click", evt);
        });

        let mousedOver = false;
        this.mouseInput.onMouseMove(evt => {
            const mouse = {
                x: evt.event.x,
                y: evt.event.y,
                width: 5,
                height: 5
            }
            if (mousedOver && !CollisionDetector.hasCollision(mouse, this)) {
                mousedOver = false;
                triggerEventHandlers("mouseout", evt);
            }
            if (!CollisionDetector.hasCollision(mouse, this)) {
                return;
            }

            mousedOver = true;
            triggerEventHandlers("mouseover", evt);
        });

        this.mouseInput.onMouseOut(evt => {
            triggerEventHandlers("mouseout", evt);
        });
    }

}