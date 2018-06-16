import { IRenderable } from "../../rendering/renderer";
import { IFrame } from "../../textures/sprite-texture";

export class BitmapCharacter implements IRenderable {

    public x: number = 0;
    public y: number = 0;

    constructor(public key: string, public width: number, public height: number, public image: HTMLImageElement, public frame: IFrame) {

    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.drawImage(this.image, this.frame.x, this.frame.y, this.frame.width, this.frame.height, this.x, this.y, this.width, this.height);
    }

}