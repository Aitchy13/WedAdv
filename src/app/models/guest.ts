import { Character, ICharacterOptions } from "./character";
import { TextureLoader } from "../engine/textures/texture-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { MathsUtility } from "../engine/utilities/maths";
import { Vector } from "../engine/core/vector";
import { ICoordinate } from "../engine/core/core.models";

export type GuestClothing = "blue-suit";

export class IGuestOptions extends ICharacterOptions {
    name: string;
    clothing: GuestClothing;
    x: number;
    y: number;
}

export class Guest extends Character implements IRenderable {

    constructor(public options: IGuestOptions, public textureLoader: TextureLoader, public renderer: Renderer, public pathFinder: PathFinder) {
        super(renderer, pathFinder, {
            name: options.name,
            width: 36,
            height: 77,
            x: options.x,
            y: options.y
        } as ICharacterOptions);

        this.setSpriteSheet(options.clothing);
        this.setAnimations();
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

    private setSpriteSheet(clothing: GuestClothing) {
        switch (clothing) {
            case "blue-suit":
                this.spriteSheet = this.textureLoader.getSpriteSheet("male-guest-blue", true);
                break;
            default:
                throw new Error("Unsupported clothing");
        }
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

    private wantsToWalk() {
        return MathsUtility.probability(0.002);
    }

}