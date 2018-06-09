import { Character, ICharacterOptions } from "./character";
import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { MathsUtility } from "../engine/utilities/maths";
import { Vector } from "../engine/core/vector";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { ICoordinate } from "../engine/core/core.models";
import { PositionStrategy } from "../engine/physics/moveable";
import { Rectangle } from "../engine/game-objects/rectangle";

export interface ITargetOptions extends ICharacterOptions {
    name: string;
    x: number;
    y: number;
    player: Character;
    hidingSpots: IHidingSpot[];
}

export interface IHidingSpot {
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
    shape: Rectangle;
    hiddenObject: Target;
}

export class Target extends Character implements IRenderable {

    private player: Character;
    private hidingSpots: IHidingSpot[];
    private hidingSpot: IHidingSpot;
    private caught: boolean;

    constructor(public options: ITargetOptions, public textureLoader: AssetLoader, public renderer: Renderer, public pathFinder: PathFinder) {
        super(renderer, pathFinder, {
            name: options.name,
            width: 30,
            height: 50,
            x: options.x,
            y: options.y
        } as ICharacterOptions);
        this.player = options.player;
        this.hidingSpots = options.hidingSpots;

        this.spriteSheet = this.textureLoader.getSpriteSheet("noa", true);
        this.setAnimations();
        this.hideIn();
    }

    public beforeRender() {
        if (!this.caught && CollisionDetector.hasCollision(this.player, this)) {
            this.remove();
            this.caught = true;
            // alert(`You caught ${this.name}!`);
            this.stopHolding();
        }
        if (this.hidingSpot && CollisionDetector.hasCollision(this.player, this.hidingSpot)) {
            this.y = this.hidingSpot.y - 50;
            this.hidingSpot = undefined;
            this.runAway();
        }
    }

    public hideIn(animate?: boolean) {
        if (this.hidingSpot) {
            this.hidingSpot.hiddenObject = undefined;
        }
        this.hidingSpot = this.hidingSpots[MathsUtility.randomIntegerRange(0, this.hidingSpots.length - 1)];
        this.hidingSpot.hiddenObject = this;
        if (animate) {
            this.runTo({ x: this.hidingSpot.x - 1, y: this.hidingSpot.y - 1 });
        } else {
            this.move(this.hidingSpot.x, this.hidingSpot.y, PositionStrategy.Absolute);
        }        
    }

    public runAway() {
        const unblockedCells = this.pathFinder.getAvailableCoordinates();
        const randomAvailableCell = unblockedCells[MathsUtility.randomIntegerRange(0, unblockedCells.length - 1)];
        this.runTo(randomAvailableCell, () => {
            if (MathsUtility.probability(0.1)) {
                this.hideIn()
            } else {
                this.runAway();
            }
        });
    }

    public runTo(coordinate: ICoordinate, onComplete?: () => void) {
        this.goTo(coordinate, 150, () => {
            if (onComplete) {
                onComplete();
            }
        });
    }

    private findCoordAwayFrom(awayFrom: Vector) {
        const unblockedCells = this.pathFinder.getAvailableCoordinates();
        const playerCell = this.pathFinder.getCellClosestTo(this.player);

        
    }

    private setAnimations() {
        this.spriteSheet.addAnimation("walk-south", [
            "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward",
            "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward"], true);

        this.spriteSheet.addAnimation("walk-north", [
            "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward",
            "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward"], true);

        this.spriteSheet.addAnimation("walk-east", [
            "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward",
            "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward"], true);

        this.spriteSheet.addAnimation("walk-west", [
            "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward",
            "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward"], true);
    }

}