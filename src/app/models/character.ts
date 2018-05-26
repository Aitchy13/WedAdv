import { IRenderable, FrameRenderer } from "../engine/rendering/frame-renderer";
import { Rectangle } from "../engine/game-objects/rectangle";

export class ICharacterOptions {
    name: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export class Character implements IRenderable {

    public shape: Rectangle;
    public name: string;

    private visible: boolean;

    constructor(public renderer: FrameRenderer, public options: ICharacterOptions) {
        this.name = options.name;
        this.shape = new Rectangle(options.width, options.height, options.x, options.y);
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

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
    }

    public beforeRender() {

    }

    public afterRender() {
        
    }

}