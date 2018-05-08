import { Game } from "./engine/game-objects/game";
import { TestScene } from "./scenes/test-scene";

export class App {

    constructor(window: Window, canvas: HTMLCanvasElement) {
        const game = new Game(canvas, {
            width: 600,
            height: 400,
            scenes: [
                TestScene
            ],
            bootstrap: TestScene
        });
    }

}