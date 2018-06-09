import * as _ from "lodash";

import { Character, ICharacterOptions } from "./character";
import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { ICoordinate, Direction } from "../engine/core/core.models";
import { KeyboardInput } from "../engine/input/keyboard-input";
import { AxisDimension } from "../engine/physics/moveable";
import { SpriteSheet } from "../engine/textures/sprite-texture";
import { ICanTalk } from "../engine/ui/dialog";
import { Sound } from "../engine/audio/sound";
import { Rectangle } from "../engine/game-objects/rectangle";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Target } from "./target";

export class IPlayerOptions extends ICharacterOptions {
    model: PlayerModel;
    x: number;
    y: number;
}

export interface IInteractable {
    onInteraction: (type: string, interactor: IInteractable, data?: any) => void;
    x: number;
    y: number;
    width: number;
    height: number;
}

export type PlayerModel = "groom" | "bride";

export class Player extends Character implements IRenderable, ICanTalk, IInteractable {

    public dialogSpriteSheet: SpriteSheet;

    private model: PlayerModel;
    private walkSound: Sound;
    private interactables: IInteractable[] = [];
    private detectedInteractable: IInteractable;

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

    public onInteraction(evtName: string, interactor: IInteractable, data: any) {
        switch (evtName) {
            case "hold":
                this.holding ? this.stopHolding() : this.hold(interactor);
                break;
            case "check-for-target":
                const target = data instanceof Target ? data : undefined;
                if (target) {
                    target.runAway();
                }
                break;
        }
    }

    public beforeRender(ctx: CanvasRenderingContext2D, delta: number) {
        if (this.lastMovedDirection !== Direction.None && this.interactables.length > 0) {
            const detectionSize: number = 50;
            let detectionArea: Rectangle;
            switch (this.lastMovedDirection) {
                case Direction.North:
                    detectionArea = new Rectangle(detectionSize, detectionSize, this.x, this.y - detectionSize);
                    break;
                case Direction.East:
                    detectionArea = new Rectangle(detectionSize, detectionSize, this.x + detectionSize, this.y);
                    break;
                case Direction.South:
                    detectionArea = new Rectangle(detectionSize, detectionSize, this.x, this.y + detectionSize);
                    break;
                case Direction.West:
                    detectionArea = new Rectangle(detectionSize, detectionSize, this.x - detectionSize, this.y);
                    break;
                default:
                    return;
            }
            this.detectedInteractable = _.find(this.interactables, x => CollisionDetector.hasCollision(x, detectionArea));
            if (this.detectedInteractable) {
                detectionArea.setColor("green");
            } else {
                detectionArea.setColor("red");
            }
            detectionArea.render(ctx, delta);
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
                    this.lastMovedDirection = Direction.North;
                    break;
                case "s":
                case "ArrowDown":
                    this.setVelocity(AxisDimension.Y, sensitivity);
                    this.defaultSpriteFrame = "south-stand";
                    this.spriteSheet.playAnimation("walk-south");
                    this.walkSound.loop();
                    this.lastMovedDirection = Direction.South;
                    break;
                case "a":
                case "ArrowLeft":
                    this.setVelocity(AxisDimension.X, -sensitivity);
                    this.defaultSpriteFrame = "west-stand";
                    this.spriteSheet.playAnimation("walk-west");
                    this.walkSound.loop();
                    this.lastMovedDirection = Direction.West;
                    break;
                case "d":
                case "ArrowRight":
                    this.setVelocity(AxisDimension.X, sensitivity);
                    this.defaultSpriteFrame = "east-stand";
                    this.spriteSheet.playAnimation("walk-east");
                    this.walkSound.loop();
                    this.lastMovedDirection = Direction.East;
                    break;
                case "e":
                    if (this.detectedInteractable) {
                        this.detectedInteractable.onInteraction("check-for-target", this);
                    }
            }
        });
        this.keyboardInput.on("keyup", () => {
            this.setVelocity(AxisDimension.XY, 0);
            this.spriteSheet.stopAnimation();
            this.walkSound.stop();
        });
        return this;
    }

    public addInteractable(interactable: IInteractable) {
        if (!interactable) {
            throw new Error("No interactable specified");
        }
        if (_.findIndex(this.interactables, x => x === interactable) !== -1) {
            throw new Error("Interactable has already been added");
        }
        this.interactables.push(interactable);
    }

    public removeInteractable(interactable: IInteractable) {
        const index = _.findIndex(this.interactables, x => x === interactable);
        if (index === -1) {
            return;
        }
        this.interactables.splice(index, 1);
    }

}