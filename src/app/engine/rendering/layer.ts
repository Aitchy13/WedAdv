import { ImageTexture } from "../textures/image-texture";
import { IRenderable, Renderer } from "./renderer";
import { Rectangle } from "../game-objects/rectangle";

export class Layer implements IRenderable {

    private visible: boolean = false;

    constructor (public key: string, public x: number, public y: number, public texture: ImageTexture|Rectangle, public renderer: Renderer) {
        this.show();
    }

    public show() {
        if (this.visible) {
            return;
        }
        this.renderer.addObject(this);
        this.visible = true;
    }

    public hide() {
        if (!this.visible) {
            return;
        }
        this.renderer.removeObject(this);
        this.visible = false;
    }

    public toggle() {
        this.visible ? this.hide() : this.show();
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        if (this.texture instanceof ImageTexture) {
            ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
            return;
        }
        if (this.texture instanceof Rectangle) {
            this.texture.render(ctx, timeDelta);
            return;
        }
    }

    public beforeRender() {

    }

    public afterRender() {
        
    }

}