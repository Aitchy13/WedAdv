import { Shape } from "./shape";
import { Vector } from "../core/vector";
import { Moveable, IMoveable, PositionStrategy, AxisDimension } from "../physics/moveable";
import { Time } from "../utilities/time";
import { SpriteSheet } from "../textures/sprite-texture";
import { Tween } from "../animation/tween";
import { IEasingFunc } from "../animation/easing";
import { ImageTexture } from "../textures/image-texture";
import { IRenderable } from "../rendering/frame-renderer";

@Moveable()
export class Rectangle implements IMoveable, IRenderable {

    public key: string;

    public color: string;
    public spriteSheet: SpriteSheet;
    public spriteKey: string;
    public imageTexture: ImageTexture;

    public degree: number = 0;
    public degreeVel: number = 0;

    // Applied by @Moveable decorator
    public xVel: number = 0;
    public yVel: number = 0;
    public origin: Vector;
    public vertices: Vector[];
    public move: (x: number, y: number, positionStrategy: PositionStrategy) => void;
    public movePath: (path: Vector[], duration?: number, easing?: IEasingFunc, onComplete?: Function, onUpdate?: Function) => void;
    public getVelocity: () => { x: number, y: number };
    public setVelocity: (dimension: AxisDimension, value: number) => this;
    public adjustVelocity: (dimension: AxisDimension, value: number) => this;

    constructor(public width: number, public height: number, x: number, y: number) {
        this.origin = new Vector(x, y);
        this.vertices = [
            this.origin, // top left
            this.origin.add(new Vector(this.width, 0)), // top right
            this.origin.add(new Vector(this.width, this.height)), // bottom right
            this.origin.add(new Vector(0, this.height)) // bottom left
        ];
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.move(this.xVel * timeDelta, this.yVel * timeDelta, PositionStrategy.Relative);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.origin.x, this.origin.y);
        this.vertices.forEach(vector => ctx.lineTo(vector.x, vector.y));
        ctx.closePath();

        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        if (this.spriteSheet) {
            ctx.clip();
            this.spriteSheet.renderContext = ctx;
            this.spriteSheet.triggerAnimationTick();
            const sprite = this.spriteSheet.currentFrame ? this.spriteSheet.currentFrame : this.spriteSheet.getFrame(this.spriteKey) ? this.spriteSheet.getFrame(this.spriteKey) : this.spriteSheet.frames[0];
            if (!sprite) {
                throw new Error(`No sprite with the key ${this.spriteKey} could be found`);
            }
            ctx.drawImage(this.spriteSheet.image, sprite.x, sprite.y, sprite.width, sprite.height, this.origin.x, this.origin.y, this.width, this.height);
        } else if (this.imageTexture) {
            ctx.clip();
            ctx.drawImage(this.imageTexture.image, this.origin.x, this.origin.y, this.imageTexture.width, this.imageTexture.height);
        }
        ctx.restore();
    }

    public setColor(color: string) {
        this.color = color;
        return this;
    }

    public beforeRender() {

    }

    public afterRender() {

    }

}