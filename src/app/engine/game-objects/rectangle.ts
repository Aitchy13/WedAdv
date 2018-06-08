import { Vector } from "../core/vector";
import { Moveable, IMoveable, PositionStrategy, AxisDimension } from "../physics/moveable";
import { SpriteSheet } from "../textures/sprite-texture";
import { IEasingFunc } from "../animation/easing";
import { ImageTexture } from "../textures/image-texture";
import { IRenderable } from "../rendering/renderer";

@Moveable()
export class Rectangle implements IMoveable, IRenderable {

    public key: string;

    public fill: string;
    public stroke: string;
    public gradient: [string, number][];
    
    public text: string;
    public textColor: string = "red";
    public textAlign: string = "center";

    public spriteSheet: SpriteSheet;
    public spriteKey: string;
    public imageTexture: ImageTexture;

    public degree: number = 0;
    public degreeVel: number = 0;

    public fixedPosition = false;

    // Applied by @Moveable decorator
    public xVel: number = 0;
    public yVel: number = 0;
    public vertices: Vector[];
    public move: (x: number, y: number, positionStrategy: PositionStrategy) => void;
    public movePath: (path: Vector[], duration?: number, easing?: IEasingFunc, onComplete?: Function, onUpdate?: Function) => void;
    public getVelocity: () => { x: number, y: number };
    public setVelocity: (dimension: AxisDimension, value: number) => this;
    public adjustVelocity: (dimension: AxisDimension, value: number) => this;

    constructor(public width: number, public height: number, public x: number, public y: number) {

        const origin = new Vector(x, y);
        this.vertices = [
            origin, // top left
            origin.add(new Vector(this.width, 0)), // top right
            origin.add(new Vector(this.width, this.height)), // bottom right
            origin.add(new Vector(0, this.height)) // bottom left
        ];
    }

    public rotate(degree: number) {
        this.degree = degree;
        this.vertices.forEach(vector => Vector.rotate(new Vector(this.x, this.y), vector, degree));
        return this;
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number, positionStrategy: PositionStrategy = PositionStrategy.Relative) {
        // if (positionStrategy === PositionStrategy.Absolute) {
        //     this.move(this.x, this.y, positionStrategy);
        // } else {
        //     this.move(this.xVel * timeDelta, this.yVel * timeDelta, positionStrategy);
        // }
        
        let diffX = (this.x - this.vertices[0].x);
        if (this.xVel) {
            diffX += this.xVel * timeDelta;
        }
        let diffY = (this.y - this.vertices[0].y);
        if (this.yVel) {
            diffY += this.yVel * timeDelta;
        }
        this.vertices[0] = new Vector(this.x, this.y);
        [this.vertices[1], this.vertices[2], this.vertices[3]].forEach(v => v.addMerge(new Vector(diffX, diffY)));

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.vertices.forEach(vector => ctx.lineTo(vector.x, vector.y));
        ctx.closePath();

        if (this.gradient) {
            const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
            for (const stops of this.gradient) {
                gradient.addColorStop(stops[1], stops[0]);
            }
            ctx.fillStyle = gradient;
            ctx.fill();
        } else if (this.fill) {
            ctx.fillStyle = this.fill;
            ctx.fill();
        }

        if (this.stroke) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = this.stroke;
        }

        

        if (this.spriteSheet) {
            ctx.clip();
            this.spriteSheet.renderContext = ctx;
            this.spriteSheet.triggerAnimationTick();
            const sprite = this.spriteSheet.currentFrame ? this.spriteSheet.currentFrame : this.spriteSheet.getFrame(this.spriteKey) ? this.spriteSheet.getFrame(this.spriteKey) : this.spriteSheet.frames[0];
            if (!sprite) {
                throw new Error(`No sprite with the key ${this.spriteKey} could be found`);
            }
            ctx.drawImage(this.spriteSheet.image, sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);
        } else if (this.imageTexture) {
            ctx.clip();
            ctx.drawImage(this.imageTexture.image, this.x, this.y, this.imageTexture.width, this.imageTexture.height);
        }

        if (this.text) {
            ctx.font = "10px Arial";
            ctx.fillStyle = this.textColor;
            ctx.textAlign = this.textAlign;
            ctx.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
        }

        ctx.restore();
    }

    public setColor(color: string) {
        this.fill = color;
        return this;
    }

    public beforeRender() {

    }

}