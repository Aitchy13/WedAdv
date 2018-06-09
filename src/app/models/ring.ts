import { AssetLoader } from "../engine/textures/asset-loader";
import { Renderer, IRenderable } from "../engine/rendering/renderer";
import { Rectangle } from "../engine/game-objects/rectangle";
import { IInteractable } from "./player";

export class Ring implements IRenderable, IInteractable {

    public name: string = "Wedding Ring";
    public width: number = 60;
    public height: number = 60;
    
    private shape: Rectangle;
    private visible: boolean = false;

    constructor(public x: number, public y: number, private assetLoader: AssetLoader, private renderer: Renderer) {
        this.shape = new Rectangle(this.width, this.height, this.x, this.y);
        this.setSpriteSheet(this.shape);
        this.show();
    }

    public show() {
        if (this.visible) {
            return;
        }
        this.visible = true;
        this.renderer.addObject(this);
        this.shape.spriteSheet.playAnimation("sparkle");
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
        
    }

    private setSpriteSheet(shape: Rectangle) {
        shape.spriteSheet = this.assetLoader.getSpriteSheet("ring");
        shape.spriteSheet.addAnimation("sparkle", ["ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-1", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-2", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3", "ring-shine-3"], true);
    }

}