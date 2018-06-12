import { Character, ICharacterOptions } from "./character";
import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { PathFinder } from "../engine/navigation/pathfinder";
import { ICanTalk } from "../engine/ui/dialog";
import { SpriteSheet } from "../engine/textures/sprite-texture";

export class Pastor extends Character implements IRenderable, ICanTalk {

    public dialogSpriteSheet: SpriteSheet;

    constructor(public x: number, public y: number, public assetLoader: AssetLoader, public renderer: Renderer, public pathFinder: PathFinder) {
        super(renderer, pathFinder, {
            name: "Pastor",
            width: 36,
            height: 77,
            x: x,
            y: y
        } as ICharacterOptions);
        this.spriteSheet = this.assetLoader.getSpriteSheet("vicar", true);
        this.dialogSpriteSheet = this.assetLoader.getSpriteSheet("vicar", true);
        this.dialogSpriteSheet.setDefaultFrame("mouth-open")
        this.setAnimations();
    }

    private setAnimations() {
        this.dialogSpriteSheet.addAnimation("talk", [
            "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open",
            "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed",
            "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-open", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed", "mouth-closed"
        ], true);
    }

    public startTalking() {
        this.dialogSpriteSheet.playAnimation("talk");
    }

    public stopTalking() {
        this.dialogSpriteSheet.stopAnimation();
    }

}