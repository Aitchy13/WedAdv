import { Character, ICharacterOptions } from "./character";
import { TextureLoader } from "../engine/textures/texture-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { MathsUtility } from "../engine/utilities/maths";
import { Vector } from "../engine/core/vector";

export class IPlayerOptions extends ICharacterOptions {
    name: string;
    model: PlayerModel;
    x: number;
    y: number;
}

export type PlayerModel = "groom" | "bride";

export class Player extends Character implements IRenderable {

    private model: PlayerModel;

    constructor(public options: IPlayerOptions, public textureLoader: TextureLoader, public renderer: Renderer, public pathFinder: PathFinder) {
        super(renderer, pathFinder, {
            name: options.name,
            width: 39,
            height: 75,
            x: options.x,
            y: options.y
        } as ICharacterOptions);
        this.model = options.model;
        this.setSpritesheet();
        this.setAnimations();
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
    }

    private setSpritesheet() {
        switch (this.model) {
            case "groom":
                throw new Error("Groom not added yet");
            case "bride":
                this.spriteSheet = this.textureLoader.getSpriteSheet("bride", true);
                break;
            default:
                throw new Error("Invalid player model");
        }
    }

    private setAnimations() {
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