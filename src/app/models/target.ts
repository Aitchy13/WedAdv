import { Character, ICharacterOptions } from "./character";
import { TextureLoader } from "../engine/textures/texture-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { MathsUtility } from "../engine/utilities/maths";
import { Vector } from "../engine/core/vector";
import { CollisionDetector } from "../engine/detectors/collision-detector";

export interface ITargetOptions extends ICharacterOptions {
    name: string;
    x: number;
    y: number;
    player: Character;
    hidingSpots: IHidingSpot[];
}

export interface IHidingSpot {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Target extends Character implements IRenderable {

    private player: Character;
    private hidingSpots: IHidingSpot[];
    private hidingIn: IHidingSpot;
    private caught: boolean;

    constructor(public options: ITargetOptions, public textureLoader: TextureLoader, public renderer: Renderer, public pathFinder: PathFinder) {
        super(renderer, pathFinder, {
            name: options.name,
            width: 36,
            height: 77,
            x: options.x,
            y: options.y
        } as ICharacterOptions);
        this.player = options.player;
        this.hidingSpots = options.hidingSpots;

        this.spriteSheet = this.textureLoader.getSpriteSheet("male-guest-blue", true);
        this.setAnimations();
        this.hideInSpot(this.hidingSpots[MathsUtility.randomIntegerRange(0, this.hidingSpots.length - 1)]);
    }

    public beforeRender() {
        // const walkRecursion = () => {
        //     if (!this.isWalking && this.wantsToWalk()) {
        //         const availableCells = this.pathFinder.getAvailableCoordinates();
        //         const cell = availableCells[MathsUtility.randomIntegerRange(0, availableCells.length - 1)];
        //         this.walk(new Vector(cell.x, cell.y), () => {
        //             walkRecursion();
        //         });
        //     }
        // }
        // walkRecursion();
        
        if (!this.caught && CollisionDetector.hasCollision(this.player, this)) {
            this.remove();
            alert("You caught Noah!");
        }
    }

    public hideInSpot(hidingSpot: IHidingSpot) {
        this.hidingIn = hidingSpot;
        this.x = hidingSpot.x;
        this.y = hidingSpot.y;
    }

    public runAway() {
        const unblockedCells = this.pathFinder.getAvailableCoordinates();
        const randomAvailableCell = unblockedCells[MathsUtility.randomIntegerRange(0, unblockedCells.length - 1)];
        this.walk(new Vector(randomAvailableCell.x, randomAvailableCell.y), 100, () => {
            this.runAway();
        });
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