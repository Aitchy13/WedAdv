import { ImageTexture } from "../textures/image-texture";
import { IRenderable } from "./frame-renderer";

export class Layer implements IRenderable {

    constructor (public key: string, public x: number, public y: number, public texture: ImageTexture) {
        
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
    }

    public beforeRender() {

    }

    public afterRender() {
        
    }

}