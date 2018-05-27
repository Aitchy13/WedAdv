import { IGameConfig } from "./game.models";
import { SceneManager } from "./scene-manager";
import { Logger } from "../utilities/logger";
import { Renderer } from "../rendering/renderer";
import { KeyboardInput } from "../input/keyboard-input";
import { Time } from "../utilities/time";
import { TextureLoader } from "../textures/texture-loader";
import { MouseInput } from "../input/mouse-input";
import { Camera } from "../rendering/camera";

export class Game {

    public sceneManager: SceneManager;
    public logger: Logger;
    public keyboardInput: KeyboardInput;
    public mouseInput: MouseInput;
    public renderer: Renderer;
    public window: Window;
    public time: Time;
    public textureLoader: TextureLoader;
    public camera: Camera;

    constructor(public readonly canvas: HTMLCanvasElement, public config: IGameConfig) {
        this.canvas = canvas;
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        this.window = window;
        this.logger = new Logger();
        this.keyboardInput = new KeyboardInput();
        this.mouseInput = new MouseInput(this.canvas);
        this.time = new Time();
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        this.renderer = new Renderer(this.canvas.getContext("2d"), this.window, this.logger, this.time, this.camera);
        this.textureLoader = new TextureLoader(this.logger);

        this.sceneManager = new SceneManager(this.logger, this, this.textureLoader);
        this.config.scenes.forEach(x => this.sceneManager.registerScene(x));
        this.sceneManager.load(this.config.bootstrap);
        
        this.renderer.start();
    }

}