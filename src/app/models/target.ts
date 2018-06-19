import * as _ from "lodash";

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
import { ICanTalk } from "../engine/ui/dialog";
import { SpriteSheet } from "../engine/textures/sprite-texture";
import { ICell } from "../engine/navigation/nav-grid";
import { IInteractable } from "./player";

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

export type TargetEventName = "caught" | "found";

interface IFurthestCell {
    distance: number;
    cell: ICell;
}

export class Target extends Character implements IRenderable, ICanTalk, IInteractable {

    public dialogSpriteSheet: SpriteSheet;
    public hidingSpot: IHidingSpot;

    private player: Character;
    private hidingSpots: IHidingSpot[];
    private caught: boolean = false;
    private found: boolean = false;

    private eventHandlers: {
        "caught": Function[];
        "found": Function[];
    };

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

        this.eventHandlers = {
            "caught": [],
            "found": []
        };

        this.spriteSheet = this.textureLoader.getSpriteSheet("noa", true);
        this.dialogSpriteSheet = this.textureLoader.getSpriteSheet("noa", true);
        this.setAnimations();
        this.show();
    }

    public beforeRender() {
        if (this.caught) {
            this.caught = false;
            this.onCaught();
            return;
        } else if (this.hidingSpot && this.found) {
            this.found = false;
            this.onFound();
        }
    }

    public on(eventName: TargetEventName, callback: Function) {
        this.eventHandlers[eventName].push(callback);
    }

    public onInteraction(evtName: string, interactor: IInteractable) {
        switch (evtName) {
            case "catch":
                this.onCaught();
                break;
        }
    }

    public onFound() {
        this.y = this.hidingSpot.y - 50;
        const spawnableCells = this.pathFinder.getSurroundingCells(this.hidingSpot, 1);
        const randomNumberInRange = MathsUtility.randomIntegerRange(0, spawnableCells.length - 1);

        const spawnIn = spawnableCells[randomNumberInRange];
        if (!spawnIn) {
            throw new Error("No spawnable cell found");
        }
        this.x = spawnIn.x;
        this.y = spawnIn.y;

        // this.hidingSpot = undefined;
        
        this.triggerEventHandlers("found");
    }

    public hideIn(animate?: boolean) {
        if (this.hidingSpot) {
            this.hidingSpot.hiddenObject = undefined;
        }
        this.hidingSpot = this.hidingSpots[MathsUtility.randomIntegerRange(0, this.hidingSpots.length - 1)];
        this.hidingSpot.hiddenObject = this;
        if (animate) {
            this.runTo({ x: this.hidingSpot.x - 1, y: this.hidingSpot.y - 1 }).then(() => {
                this.remove();
            })
        } else {
            this.move(this.hidingSpot.x, this.hidingSpot.y, PositionStrategy.Absolute);
            this.remove();
        }
    }

    public runAway() {
        const furthest = this.findCoordAwayFrom(new Vector(this.player.x, this.player.y));

        this.pathFinder.grid.removeBlockedGeometry("player");
        this.pathFinder.grid.addBlockedGeometry("player", this.pathFinder.getSurroundingArea(this.player, 1, true));

        this.runTo(furthest.cell, () => {
            this.runAway();
        });
    }

    public runTo(coordinate: ICoordinate, onComplete?: () => void) {
        this.show();
        return new Promise((resolve) => {
            this.goTo(coordinate, 120, () => {
                if (onComplete) {
                    onComplete();
                } else {
                    resolve();
                }
            });
        });
    }

    public startTalking() {
        this.dialogSpriteSheet.playAnimation("talk");
    }

    public stopTalking() {
        this.dialogSpriteSheet.stopAnimation();
    }

    private triggerEventHandlers(eventName: TargetEventName) {
        if (this.eventHandlers[eventName].length === 0) {
            return;
        }
        for (const handler of this.eventHandlers[eventName]) {
            handler();
        }
    }
    
    private onCaught() {
        this.stopHolding();
        this.stopMovement();
        this.pathFinder.grid.removeBlockedGeometry("player");
        this.triggerEventHandlers("caught");
    }

    private findCoordAwayFrom(awayFrom: Vector): IFurthestCell {
        const unblockedCells = this.pathFinder.getAvailableCoordinates();
        const awayFromCell = this.pathFinder.getCellClosestTo(awayFrom, true);

        const awayFromVector = new Vector(awayFromCell.x, awayFromCell.y);

        const furthest: IFurthestCell = _.reduce(unblockedCells, (memo: any, d) => {
            const distance = awayFromVector.calculateDistance(new Vector(d.x, d.y));
            if (distance > memo.distance) {
                return {
                    distance,
                    cell: d
                };
            }
            return memo;
        }, { cell: undefined, distance: 0 });
        return furthest;
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
        
        this.dialogSpriteSheet.addAnimation("talk", [
            "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open",
            "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed",
            "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed"
        ], true);
        this.dialogSpriteSheet.setDefaultFrame("mouth-open");
    }

}