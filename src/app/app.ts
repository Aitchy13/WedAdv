import { Game } from "./engine/game-objects/game";
import { InsideScene } from "./scenes/inside.scene";

export class App {

    constructor(window: Window, canvas: HTMLCanvasElement) {
        const game = new Game(canvas, {
            width: 600,
            height: 400,
            scenes: [
                InsideScene
            ],
            bootstrap: InsideScene
        });
    }

}