import { Character, ICharacterOptions } from "./character";
import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { ICoordinate } from "../engine/core/core.models";
import { KeyboardInput } from "../engine/input/keyboard-input";
import { AxisDimension } from "../engine/physics/moveable";
import { SpriteSheet } from "../engine/textures/sprite-texture";
import { ICanTalk } from "../engine/ui/dialog";
import { Sound } from "../engine/audio/sound";

export class IPlayerOptions extends ICharacterOptions {
    model: PlayerModel;
    x: number;
    y: number;
}

export interface IInteractable {
    onInteraction: (type: string, interactor: IInteractable) => void;
    x: number;
    y: number;
}

export type PlayerModel = "groom" | "bride";

export class Player extends Character implements IRenderable, ICanTalk, IInteractable {

    public dialogSpriteSheet: SpriteSheet;

    private model: PlayerModel;
    private walkSound: Sound;
    private interactable: IInteractable;

    constructor(public options: IPlayerOptions, public assetLoader: AssetLoader, public renderer: Renderer, public pathFinder: PathFinder, public keyboardInput: KeyboardInput) {
        super(renderer, pathFinder, {
            width: options.model === "bride" ? 43 : 36,
            height: options.model === "bride" ? 77 : 79,
            x: options.x,
            y: options.y
        } as ICharacterOptions);

        this.model = options.model;
        this.name = options.model === "bride" ? "Hannah" : "Harry";

        this.setSpriteSheet(this.model);
        this.setAnimations(this.model);

        this.walkSound = this.assetLoader.getSound("running");
        this.walkSound.load();

    }

    public walkTo(coordinate: ICoordinate, onComplete?: () => void) {
        this.goTo(coordinate, 200, () => {
            if (onComplete) {
                onComplete();
            }
        });
    }

    public onInteraction(evtName: string, interactor: IInteractable) {
        switch (evtName) {
            case "hold":
                this.holding ? this.stopHolding() : this.hold(interactor);
                break;
        }
    }

    private setSpriteSheet(model: PlayerModel) {
        switch (model) {
            case "groom":
                this.spriteSheet = this.assetLoader.getSpriteSheet("groom", true);
                this.dialogSpriteSheet = this.assetLoader.getSpriteSheet("groom-dialog", true);
                break;
            case "bride":
                this.spriteSheet = this.assetLoader.getSpriteSheet("bride", true);
                this.dialogSpriteSheet = this.assetLoader.getSpriteSheet("bride-dialog", true);
                break;
            default:
                throw new Error("Invalid player model");
        }
    }

    private setAnimations(model: PlayerModel) {
        this.dialogSpriteSheet.addAnimation("talk", [
            "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open",
            "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed",
            "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed"
        ], true);
        
        if (model === "bride") {
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
            return;
        }
        if (model === "groom") {
            this.spriteSheet.addAnimation("walk-south", [
                "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm",
                "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm"], true);
            this.spriteSheet.addAnimation("walk-north", [
                "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm",
                "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm"], true);
            this.spriteSheet.addAnimation("walk-east", [
                "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg", "east-left-leg",
                "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg", "east-right-leg"], true);
            this.spriteSheet.addAnimation("walk-west", [
                "west-left-arm", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg", "west-left-leg",
                "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg", "west-right-leg"], true);
            return;
        }
    }

    public startTalking() {
        this.dialogSpriteSheet.playAnimation("talk");
    }

    public stopTalking() {
        this.dialogSpriteSheet.stopAnimation();
    }

    public enableControls(): Player {
        this.keyboardInput.on("keydown", evt => {
            const sensitivity = 2.5;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    this.setVelocity(AxisDimension.Y, -sensitivity);
                    this.defaultSpriteFrame = "north-stand";
                    this.spriteSheet.playAnimation("walk-north");
                    this.walkSound.loop();
                    break;
                case "s":
                case "ArrowDown":
                    this.setVelocity(AxisDimension.Y, sensitivity);
                    this.defaultSpriteFrame = "south-stand";
                    this.spriteSheet.playAnimation("walk-south");
                    this.walkSound.loop();
                    break;
                case "a":
                case "ArrowLeft":
                    this.setVelocity(AxisDimension.X, -sensitivity);
                    this.defaultSpriteFrame = "west-stand";
                    this.spriteSheet.playAnimation("walk-west");
                    this.walkSound.loop();
                    break;
                case "d":
                case "ArrowRight":
                    this.setVelocity(AxisDimension.X, sensitivity);
                    this.defaultSpriteFrame = "east-stand";
                    this.spriteSheet.playAnimation("walk-east");
                    this.walkSound.loop();
                    break;
                case "e":
                    this.interactable.onInteraction("hold", this);
            }
        });
        this.keyboardInput.on("keyup", () => {
            this.setVelocity(AxisDimension.XY, 0);
            this.spriteSheet.stopAnimation();
            this.walkSound.stop();
        });
        return this;
    }

    public setInteractable(interactable: IInteractable) {
        this.interactable = interactable;
    }

}