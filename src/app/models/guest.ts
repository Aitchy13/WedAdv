import { Character, ICharacterOptions } from "./character";
import { TextureLoader } from "../engine/textures/texture-loader";
import { FrameRenderer, IRenderable } from "../engine/rendering/frame-renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { MathsUtility } from "../engine/utilities/maths";
import { Vector } from "../engine/core/vector";

export type GuestClothing = "blue-suit";

export class IGuestOptions extends ICharacterOptions {
    name: string;
    clothing: GuestClothing;
    x: number;
    y: number;
}

export class Guest extends Character implements IRenderable {

    private isWalking: boolean = false;

    constructor(public options: IGuestOptions, public textureLoader: TextureLoader, public renderer: FrameRenderer, public pathFinder: PathFinder) {
        super(renderer, {
            name: options.name,
            width: 36,
            height: 77,
            x: options.x,
            y: options.y
        } as ICharacterOptions);

        this.setSpritesheet(options.clothing);
        this.setAnimations();
    }

    public beforeRender() {
        const walkRecursion = () => {
            if (!this.isWalking && this.wantsToWalk()) {
                const availableCells = this.pathFinder.getAvailableCoordinates();
                const cell = availableCells[MathsUtility.randomIntegerRange(0, availableCells.length - 1)];
                this.walk(new Vector(cell.x, cell.y), () => {
                    walkRecursion();
                });
            }
        }
        walkRecursion();
    }

    private setSpritesheet(clothing: GuestClothing) {
        switch (clothing) {
            case "blue-suit":
                this.shape.spriteSheet = this.textureLoader.getSpriteSheet("male-guest-blue", true);
                break;
            default:
                throw new Error("Unsupported clothing");
        }
    }

    private setAnimations() {
        this.shape.spriteSheet.addAnimation("walk-south", [
            "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward", "south-left-foot-forward",
            "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward", "south-right-foot-forward"], true);

        this.shape.spriteSheet.addAnimation("walk-north", [
            "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward", "north-left-foot-forward",
            "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward", "north-right-foot-forward"], true);

        this.shape.spriteSheet.addAnimation("walk-east", [
            "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward", "east-left-foot-forward",
            "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward", "east-right-foot-forward"], true);

        this.shape.spriteSheet.addAnimation("walk-west", [
            "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward", "west-left-foot-forward",
            "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward", "west-right-foot-forward"], true);
    }

    private wantsToWalk() {
        return MathsUtility.probability(0.002);
    }

    private walk(coordinate: Vector, onComplete?: () => void) {
        if (this.isWalking) {
            return;
        }
        this.isWalking = true;
        const path = this.pathFinder.findPath(this.shape.origin, new Vector(coordinate.x, coordinate.y));
        this.shape.movePath(path, 200, undefined, () => {
            this.isWalking = false;
            if (onComplete) {
                onComplete();
            }
        }, (currentPosition: Vector, destination: Vector) => {
            switch (this.getDirection(currentPosition, destination)) {
                case "east":
                    this.shape.spriteSheet.playAnimation("walk-east");
                    break;
                case "west":
                    this.shape.spriteSheet.playAnimation("walk-west");
                    break;
                case "north":
                    this.shape.spriteSheet.playAnimation("walk-north");
                    break;
                case "south":
                    this.shape.spriteSheet.playAnimation("walk-south");
                    break;
                case "none":
                    this.shape.spriteSheet.stopAnimation();
            }
        });
    }

    private getDirection(currentPosition: Vector, destination: Vector) {
        if (currentPosition.x < destination.x && currentPosition.y === destination.y) {
            return "east";
        }
        if (currentPosition.x > destination.x && currentPosition.y === destination.y) {
            return "west";
        }
        if (currentPosition.y < destination.y && currentPosition.x === destination.x) {
            return "south";
        }
        if (currentPosition.y > destination.y && currentPosition.x === destination.x) {
            return "north";
        }
        return "none"
    }

}