import { IGameConfig } from "./game.models";
import { SceneManager } from "./scene-manager";
import { Logger } from "../utilities/logger";
import { FrameRenderer } from "../rendering/frame-renderer";
import { KeyboardInput } from "../input/keyboard-input";
import { Time } from "../utilities/time";
import { TextureLoader } from "../textures/texture-loader";

export class Game {

    public sceneManager: SceneManager;
    public logger: Logger;
    public keyboardInput: KeyboardInput;
    public renderer: FrameRenderer;
    public window: Window;
    public time: Time;
    public textureLoader: TextureLoader;

    constructor(public readonly canvas: HTMLCanvasElement, private config: IGameConfig) {
        this.canvas = canvas;
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        this.window = window;
        this.logger = new Logger();
        this.keyboardInput = new KeyboardInput();
        this.time = new Time();
        this.renderer = new FrameRenderer(this.canvas.getContext("2d"), this.window, this.logger, this.time);
        this.textureLoader = new TextureLoader();

        this.sceneManager = new SceneManager(this.logger, this, this.textureLoader);
        this.config.scenes.forEach(x => this.sceneManager.registerScene(x));
        this.sceneManager.load(this.config.bootstrap);
        
        this.renderer.start();
    }

}