import { Character, ICharacterOptions } from "./character";
import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { MathsUtility } from "../engine/utilities/maths";
import { ICoordinate } from "../engine/core/core.models";

export type GuestClothing = "blue-suit";

export type GuestGender = "male" | "female";

export class IGuestOptions extends ICharacterOptions {
    name: string;
    gender: GuestGender;
    x: number;
    y: number;
}

export class Guest extends Character implements IRenderable {

    private gender: GuestGender;

    constructor(public options: IGuestOptions, public textureLoader: AssetLoader, public renderer: Renderer, public pathFinder: PathFinder) {
        super(renderer, pathFinder, {
            name: options.name,
            width: options.gender === "male" ? 36 : 43,
            height: 77,
            x: options.x,
            y: options.y
        } as ICharacterOptions);

        this.gender = options.gender;

        this.setSpriteSheet(options.gender);
        this.setAnimations(options.gender);
    }

    public beforeRender() {
        const walkRecursion = () => {
            if (!this.isWalking && this.wantsToWalk()) {
                const availableCells = this.pathFinder.getAvailableCoordinates();
                const cell = availableCells[MathsUtility.randomIntegerRange(0, availableCells.length - 1)];
                this.walkTo(cell, () => {
                    walkRecursion();
                });
            }
        }
        walkRecursion();
    }

    public walkTo(coordinate: ICoordinate, onComplete?: () => void) {
        this.goTo(coordinate, 200, () => {
            if (onComplete) {
                onComplete();
            }
        });
    }

    public wantsToWalk() {
        return MathsUtility.probability(0.002);
    }

    private setSpriteSheet(gender: GuestGender) {
        switch (gender) {
            case "male":
                this.spriteSheet = this.textureLoader.getSpriteSheet("male-guest-blue", true);
                break;
            case "female":
                this.spriteSheet = this.textureLoader.getSpriteSheet("female-guest", true);
                break;
            default:
                throw new Error("Unsupported gender");
        }
    }

    private setAnimations(gender: GuestGender) {
        if (gender === "male") {
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
        } else if (gender === "female") {
            this.spriteSheet.addAnimation("walk-south", [
                "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm",
                "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm"], true);
            this.spriteSheet.addAnimation("walk-north", [
                "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm",
                "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm"], true);
            this.spriteSheet.addAnimation("walk-east", [
                "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm",
                "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm"], true);
            this.spriteSheet.addAnimation("walk-west", [
                "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm",
                "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm"], true);
        }
        
    }

}