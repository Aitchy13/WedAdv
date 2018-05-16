import { Game } from "./engine/game-objects/game";
import { InsideScene } from "./scenes/inside.scene";

export class App {

    constructor(window: Window, canvas: HTMLCanvasElement) {
        const game = new Game(canvas, {
            width: 480,
            height: 320,
            scenes: [
                InsideScene
            ],
            bootstrap: InsideScene
        });
    }

}