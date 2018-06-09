import * as _ from "lodash";

import { IRenderable, Renderer } from "../engine/rendering/renderer";
import { Rectangle } from "../engine/game-objects/rectangle";
import { PositionStrategy, Moveable, IMoveable, AxisDimension } from "../engine/physics/moveable";
import { IEasingFunc } from "../engine/animation/easing";
import { Vector } from "../engine/core/vector";
import { SpriteSheet } from "../engine/textures/sprite-texture";
import { PathFinder } from "../engine/navigation/pathfinder";
import { ICoordinate, Direction } from "../engine/core/core.models";
import { ICollidableShape, CollisionDetector } from "../engine/detectors/collision-detector";

export class ICharacterOptions {
    name?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export class IHoldable {
    x: number;
    y: number;
}

@Moveable()
export class Character implements IRenderable, IMoveable {

    public name: string;
    public spriteSheet: SpriteSheet;
    public defaultSpriteFrame: string;
    public width: number;
    public height: number;
    public isWalking: boolean;
    public fixedPosition = false;

    // Applied by @Moveable decorator
    public xVel: number = 0;
    public yVel: number = 0;

    public x: number;
    public y: number;

    public holding: IHoldable;
    public visible: boolean;
    
    public vertices: Vector[];
    public move: (x: number, y: number, positionStrategy: PositionStrategy) => void;
    public movePath: (path: Vector[], duration?: number, easing?: IEasingFunc, onComplete?: Function, onUpdate?: Function) => void;
    public getVelocity: () => { x: number, y: number };
    public setVelocity: (dimension: AxisDimension, value: number) => this;
    public adjustVelocity: (dimension: AxisDimension, value: number) => this;

    public lastMovedDirection: Direction;


    private collidables: ICollidableShape[] = [];


    constructor(public renderer: Renderer, public pathFinder: PathFinder, public options: ICharacterOptions) {
        this.name = options.name ? options.name : "No name";
        this.width = options.width;
        this.height = options.height;

        this.x = options.x;
        this.y = options.y;

        const shape = new Rectangle(options.width, options.height, options.x, options.y);
        this.vertices = shape.vertices;
        this.show();
    }

    public show() {
        if (this.visible) {
            return;
        }
        this.renderer.addObject(this);
        this.visible = true;
    }

    public remove() {
        if (!this.visible) {
            return;
        }
        this.renderer.removeObject(this);
        this.visible = false;
    }

    public addCollidable(collidable: ICollidableShape) {
        this.collidables.push(collidable);
    }

    public removeCollidable(collidable: ICollidableShape) {
        const index = _.findIndex(this.collidables, x => x === collidable);
        this.collidables.splice(index, 1);
    }

    public hold(holdable: IHoldable) {
        this.holding = holdable;
    }

    public stopHolding() {
        this.holding = undefined;
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        let collidesWith: ICollidableShape;
        const previousX = this.x;
        const previousY = this.y;

        this.move(this.xVel * timeDelta, this.yVel * timeDelta, PositionStrategy.Relative);

        if (this.collidables.length > 0) {
            for (const shape of this.collidables) {
                if (CollisionDetector.hasCollision(shape, this)) {
                    collidesWith = shape;
                    break;
                }
            }
        }
        if (collidesWith) {
            this.setVelocity(AxisDimension.XY, 0);
            this.move(previousX, previousY, PositionStrategy.Absolute);
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.vertices.forEach(vector => ctx.lineTo(vector.x, vector.y));
        ctx.closePath();

        ctx.clip();
        this.spriteSheet.renderContext = ctx;
        this.spriteSheet.triggerAnimationTick();
        const sprite = this.spriteSheet.currentFrame ? this.spriteSheet.currentFrame : this.spriteSheet.getFrame(this.defaultSpriteFrame) ? this.spriteSheet.getFrame(this.defaultSpriteFrame) : this.spriteSheet.frames[0];
        if (!sprite) {
            throw new Error(`No sprite with the key ${this.defaultSpriteFrame} could be found`);
        }
        ctx.drawImage(this.spriteSheet.image, sprite.x, sprite.y, sprite.width, sprite.height, this.x, this.y, this.width, this.height);

        if (this.holding) {
            this.holding.x = this.x;
            this.holding.y = this.y + 1 ;
        }

        ctx.restore();
    }

    public goTo(coordinate: ICoordinate, duration: number = 200, onComplete?: () => void) {
        if (this.isWalking) {
            return;
        }
        this.isWalking = true;
        try {
            const path = this.pathFinder.findPath(new Vector(this.x, this.y), new Vector(coordinate.x, coordinate.y));
            this.movePath(path, duration, undefined, () => {
                this.isWalking = false;
                if (onComplete) {
                    onComplete();
                }
            }, (currentPosition: Vector, destination: Vector) => {
                const direction = this.getDirection(currentPosition, destination);
                switch (direction) {
                    case Direction.East:
                        this.spriteSheet.playAnimation("walk-east");
                        this.defaultSpriteFrame = "east-stand";
                        break;
                    case Direction.West:
                        this.spriteSheet.playAnimation("walk-west");
                        this.defaultSpriteFrame = "west-stand";
                        break;
                    case Direction.North:
                        this.spriteSheet.playAnimation("walk-north");
                        this.defaultSpriteFrame = "north-stand";
                        break;
                    case Direction.South:
                        this.spriteSheet.playAnimation("walk-south");
                        this.defaultSpriteFrame = "south-stand";
                        break;
                    case Direction.None:
                        this.spriteSheet.stopAnimation();
                }
                if (direction !== Direction.None) {
                    this.lastMovedDirection = direction;
                }
            });
        } catch (e) {
            console.error(e);
        }
        
    }

    public getDirection(currentPosition: Vector, destination: Vector): Direction {
        if (currentPosition.x < destination.x && currentPosition.y === destination.y) {
            return Direction.East;
        }
        if (currentPosition.x > destination.x && currentPosition.y === destination.y) {
            return Direction.West;
        }
        if (currentPosition.y < destination.y && currentPosition.x === destination.x) {
            return Direction.South;
        }
        if (currentPosition.y > destination.y && currentPosition.x === destination.x) {
            return Direction.North;
        }
        return Direction.None;
    }

}