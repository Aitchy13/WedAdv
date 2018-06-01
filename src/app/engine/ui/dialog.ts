import { Renderer, IRenderable } from "../rendering/renderer";
import { SpriteSheet } from "../textures/sprite-texture";
import { Rectangle } from "../game-objects/rectangle";
import { AssetLoader } from "../textures/asset-loader";
import { KeyboardInput } from "../input/keyboard-input";

export interface ICanTalk {

}

export interface IDialogAvatar {
    name: string;
    spriteSheet: SpriteSheet;
}

export class DialogManager {

    constructor(private keyboardInput: KeyboardInput) {
        
    }

    

}

export class Dialog implements IRenderable {

    public x: number;
    public y: number;
    public fixedPosition = true;

    private width: number = 470;
    private height: number = 104;
    private maxCharacters: number = 255;
    private shape: Rectangle;
    private avatar: IDialogAvatar;

    private textSnippets: string[] = [];
    private textColor: string = "#fff";

    private currentSnippetIndex: number = 0;

    private visible: boolean = false;

     constructor(private renderer: Renderer, private window: Window, private assetLoader: AssetLoader) {
        this.shape = new Rectangle(this.width, this.height, (this.window.innerWidth / 2) - this.width / 2, this.window.innerHeight - this.height - 20);
        this.shape.imageTexture = this.assetLoader.getImage("dialog");
        this.x = this.shape.vertices[0].x;
        this.y = this.shape.vertices[0].y;
    }

    public setAvatar(name: string, spriteSheet: SpriteSheet) {
        this.avatar = {
            name: name,
            spriteSheet: spriteSheet
        };
    }

    public addTextSnippet(text: string) {
        this.textSnippets.push(text);
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
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = this.textColor;
        this.positionText(ctx, this.textSnippets[0]);
    }

    public chain(dialog: Dialog) {

    }

    private positionText(context: CanvasRenderingContext2D, text: string) {
        const maxWidth = 325;
        const lineHeight = 20;
        const transformedText = text.toUpperCase();
        const words = transformedText.split(" ");
        const x = this.x + 117;

        let y = this.y + 32;
        let line = "";
        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

}