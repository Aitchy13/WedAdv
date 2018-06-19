import { Rectangle } from "../engine/game-objects/rectangle";
import { IInteractable, Player } from "./player";
import { IHidingSpot, Target } from "./target";
import { Type } from "../engine/core/core.models";
import { Scene } from "../engine/game-objects/scene";
import { SceneManager } from "../engine/game-objects/scene-manager";

export class Door implements IInteractable {

    public name: string = "Door";
    public width: number = 146;
    public height: number = 113;
    public shape: Rectangle;

    private exitScene: Type<Scene>;

    constructor(public key: string, public x: number, public y: number, private sceneManager: SceneManager) {
        this.shape = new Rectangle(this.width, this.height, this.x, this.y);
        this.shape.key = key;
        this.shape.width = this.width;
        this.shape.height = this.height;
    }

    public setExit(scene: Type<Scene>): void {
        this.exitScene = scene;
    }

    public exit() {
        if (!this.exitScene) {
            throw new Error("No exit scene specified");
        }
        this.sceneManager.load(this.exitScene);
    }

    public onInteraction(evtName: string, interactor: IInteractable) {

    }

}