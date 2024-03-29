import { Game } from "./engine/game-objects/game";
import { InsideScene } from "./scenes/inside.scene";
import { OutsideScene } from "./scenes/outside.scene";

export class App {

    constructor(window: Window, rootCanvas: HTMLCanvasElement) {
        const game = new Game(rootCanvas, {
            width: window.innerWidth,
            height: window.innerHeight,
            scenes: [
                OutsideScene,
                InsideScene
            ],
            bootstrap: OutsideScene
        });

        const htmlElement = game.document.getElementsByTagName("html")[0];
        htmlElement.className = "loading";

        Promise.all([
            game.assetLoader.loadSpriteSheet("male-guest-blue", "src/sprites/male-guest-blue.png", "src/sprites/male-guest-blue.json"),
            game.assetLoader.loadSpriteSheet("female-guest", "src/sprites/female-guest.png", "src/sprites/female-guest.json"),
            game.assetLoader.loadSpriteSheet("bride", "src/sprites/bride.png", "src/sprites/bride.json"),
            game.assetLoader.loadSpriteSheet("bride-dialog", "src/sprites/bride-dialog.png", "src/sprites/bride-dialog.json"),
            game.assetLoader.loadSpriteSheet("groom", "src/sprites/groom.png", "src/sprites/groom.json"),
            game.assetLoader.loadSpriteSheet("groom-dialog", "src/sprites/groom-dialog.png", "src/sprites/groom-dialog.json"),
            game.assetLoader.loadSpriteSheet("ring", "src/sprites/ring.png", "src/sprites/ring.json"),
            game.assetLoader.loadSpriteSheet("noa", "src/sprites/noa.png", "src/sprites/noa.json"),
            game.assetLoader.loadImage("dialog", "src/sprites/dialog.png"),
            game.assetLoader.loadImage("dialog-arrow", "src/sprites/dialog-arrow.png"),
            game.assetLoader.loadSound("running", "src/sounds/running.wav"),
            game.assetLoader.loadSound("menu-open", "src/sounds/menu-open.wav"),
            game.assetLoader.loadSound("menu-close", "src/sounds/menu-close.wav"),
            game.assetLoader.loadSound("mouseclick", "src/sounds/mouseclick1.wav"),
            game.assetLoader.loadSpriteSheet("vicar", "src/sprites/vicar.png", "src/sprites/vicar.json"),
            game.assetLoader.loadSpriteSheet("countdown", "src/sprites/countdown.png", "src/sprites/countdown.json"),
            game.assetLoader.loadSound("menu-select", "src/sounds/click3.wav"),
            game.assetLoader.loadSound("pop", "src/sounds/pop-reduced.wav"),
            game.assetLoader.loadSound("blip", "src/sounds/blip.wav"),
            game.assetLoader.loadSound("bring", "src/sounds/bring.wav"),
            game.assetLoader.loadSound("intro", "src/sounds/intro.mp3"),
            game.assetLoader.loadSound("start-menu", "src/sounds/start-menu.mp3"),
            game.assetLoader.loadSound("build-up", "src/sounds/build-up.wav"),
            game.assetLoader.loadSound("enemy", "src/sounds/enemy.mp3"),
            game.assetLoader.loadSound("happy", "src/sounds/happy.mp3")
        ] as any).then(() => {
            htmlElement.className = undefined;
            game.start();
        });
        
    }

}