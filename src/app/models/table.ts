import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { Rectangle } from "../engine/game-objects/rectangle";
import { IInteractable } from "./player";
import { IHidingSpot, Target } from "./target";

export class Table implements IRenderable, IInteractable, IHidingSpot {

    public name: string = "Table";
    public width: number = 154;
    public height: number = 142;
    public shape: Rectangle;
    public hiddenObject: Target;

    private visible: boolean = false;

    constructor(public key: string, public x: number, public y: number, private assetLoader: AssetLoader, private renderer: Renderer) {
        this.shape = new Rectangle(this.width, this.height, this.x, this.y);
        this.shape.imageTexture = this.assetLoader.getImage("indoor-table");
        this.shape.key = key;
        this.shape.width = this.width;
        this.shape.height = this.height;
        this.show();
    }

    public show() {
        if (this.visible) {
            return;
        }
        this.visible = true;
        this.renderer.addObject(this);
    }

    public hide() {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        this.renderer.removeObject(this);
        this.shape.spriteSheet.stopAnimation();
    }

    public render(ctx: CanvasRenderingContext2D, delta: number) {
        this.shape.x = this.x;
        this.shape.y = this.y;
        this.shape.render(ctx, delta);
    }

    public onInteraction(evtName: string, interactor: IInteractable) {
        switch (evtName) {
            case "check-for-target":
                interactor.onInteraction(evtName, this, this.hiddenObject);
                break;
        }
    }

}