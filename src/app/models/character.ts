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
import { Tween } from "../engine/animation/tween";

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
    public movePath: (path: Vector[], duration?: number, easing?: IEasingFunc, onComplete?: Function, onUpdate?: Function, onStop?: Function) => Tween;
    public getVelocity: () => { x: number, y: number };
    public setVelocity: (dimension: AxisDimension, value: number) => this;
    public adjustVelocity: (dimension: AxisDimension, value: number) => this;
    public goingTo: Tween;

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

    public removeCollidables() {
        this.collidables = [];
    }

    public hold(holdable: IHoldable) {
        this.holding = holdable;
    }

    public stopHolding() {
        this.holding = undefined;
    }

    public faceDirection(direction: Direction) {
        switch (direction) {
            case Direction.North:
                this.spriteSheet.setDefaultFrame("north-stand");
                break;
            case Direction.East:
                this.spriteSheet.setDefaultFrame("east-stand");
                break;
            case Direction.South:
                this.spriteSheet.setDefaultFrame("south-stand");
                break;
            case Direction.West:
                this.spriteSheet.setDefaultFrame("west-stand");
                break;
        }
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
        const sprite = this.spriteSheet.currentFrame ? this.spriteSheet.currentFrame : this.spriteSheet.defaultFrame
                            ? this.spriteSheet.defaultFrame : this.spriteSheet.frames[0];
        if (!sprite) {
            throw new Error(`No sprite found`);
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
            this.goingTo = this.movePath(path, duration, undefined, () => {
                this.isWalking = false;
                if (onComplete) {
                    onComplete();
                }
            }, (currentPosition: Vector, destination: Vector) => {
                const direction = this.getDirection(currentPosition, destination);
                switch (direction) {
                    case Direction.East:
                        this.spriteSheet.playAnimation("walk-east");
                        this.spriteSheet.setDefaultFrame("east-stand");
                        break;
                    case Direction.West:
                        this.spriteSheet.playAnimation("walk-west");
                        this.spriteSheet.setDefaultFrame("west-stand");
                        break;
                    case Direction.North:
                        this.spriteSheet.playAnimation("walk-north");
                        this.spriteSheet.setDefaultFrame("north-stand");
                        break;
                    case Direction.South:
                        this.spriteSheet.playAnimation("walk-south");
                        this.spriteSheet.setDefaultFrame("south-stand");
                        break;
                    case Direction.None:
                        this.spriteSheet.stopAnimation();
                }
                if (direction !== Direction.None) {
                    this.lastMovedDirection = direction;
                }
            }, () => {
                this.isWalking = false;
            });
        } catch (e) {
            console.error(e);
            this.isWalking = false;
        }
    }

    public stopMovement() {
        if (this.goingTo) {
            this.goingTo.stop();
        }
        this.xVel = 0;
        this.yVel = 0;
        this.spriteSheet.stopAnimation();
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