import * as _ from "lodash";

import { Scene } from "../engine/game-objects/scene";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Rectangle } from "../engine/game-objects/rectangle";
import { AxisDimension, PositionStrategy, IMoveable } from "../engine/physics/moveable";
import { Vector } from "../engine/core/vector";
import { AssetLoader } from "../engine/textures/asset-loader";
import { SpriteSheet } from "../engine/textures/sprite-texture";
import { MathsUtility } from "../engine/utilities/maths";
import { NavGrid } from "../engine/navigation/nav-grid";
import { PathFinder } from "../engine/navigation/pathfinder";
import { Tween } from "../engine/animation/tween";
import { Easing } from "../engine/animation/easing";
import { Layer } from "../engine/rendering/layer";
import { Guest } from "../models/guest";
import { Sound } from "../engine/audio/sound";
import { Target } from "../models/target";
import { Player } from "../models/player";
import { Button } from "../engine/ui/button";

export class OutsideScene extends Scene {

    public width: number = 1440;
    public height: number = 1800;

    private gameTitle: Layer;
    private startButton: Button;

    private instruction: Layer;
    private groomSelection: Button;
    private brideSelection: Button;
    private playButton: Button;

    private selectedPlayer: Player;

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.assetLoader.loadImage("outdoor-scene-background", "src/sprites/outdoor-scene.png"),
            this.assetLoader.loadSpriteSheet("male-guest-blue", "src/sprites/male-guest-blue.png", "src/sprites/male-guest-blue.json"),
            this.assetLoader.loadSpriteSheet("bride", "src/sprites/bride.png", "src/sprites/bride.json"),
            this.assetLoader.loadSpriteSheet("groom", "src/sprites/groom.png", "src/sprites/groom.json"),
            this.assetLoader.loadImage("cloud-1", "src/sprites/cloud-1.png"),
            this.assetLoader.loadImage("cloud-2", "src/sprites/cloud-2.png"),
            this.assetLoader.loadImage("game-title", "src/sprites/game-title.png"),
            this.assetLoader.loadImage("select-player-text", "src/sprites/select-player-text.png"),
            this.assetLoader.loadImage("groom-player-selection", "src/sprites/groom-player-selection.png"),
            this.assetLoader.loadImage("bride-player-selection", "src/sprites/bride-player-selection.png"),
            this.assetLoader.loadImage("start-button", "src/sprites/start-button.png"),
            this.assetLoader.loadImage("play-button", "src/sprites/play-button.png"),
            this.assetLoader.loadSound("menu-select", "src/sounds/menu-select.wav")
        ] as any);
    }

    public render() {
        const sky = new Rectangle(this.width, 934, 0, 0);
        sky.gradient = [["#b1e0f2", 1], ["#7d9bf2", 0]];

        new Layer("sky", 0, 0, sky, this.game.renderer);
        new Layer("outdoor-scene", 0, 850, this.assetLoader.getImage("outdoor-scene-background"), this.game.renderer);

        new Layer("cloud-a", 430, 190, this.assetLoader.getImage("cloud-1"), this.game.renderer);
        new Layer("cloud-b", 360, 82, this.assetLoader.getImage("cloud-2"), this.game.renderer);
        new Layer("cloud-c", 793, 55, this.assetLoader.getImage("cloud-2"), this.game.renderer);
        new Layer("cloud-d", 860, 210, this.assetLoader.getImage("cloud-2"), this.game.renderer);
        new Layer("cloud-e", 1232, 248, this.assetLoader.getImage("cloud-2"), this.game.renderer);
        new Layer("cloud-f", 1093, 431, this.assetLoader.getImage("cloud-1"), this.game.renderer);
        new Layer("cloud-g", 1223, 620, this.assetLoader.getImage("cloud-2"), this.game.renderer);
        new Layer("cloud-h", 353, 500, this.assetLoader.getImage("cloud-2"), this.game.renderer);
        new Layer("cloud-i", 100, 575, this.assetLoader.getImage("cloud-1"), this.game.renderer);
        new Layer("cloud-j", 184, 380, this.assetLoader.getImage("cloud-2"), this.game.renderer);

        this.game.camera.setBoundaries(0, this.width, 0, this.height);

        this.showTitleScreen();
    }

    private showTitleScreen() {
        const gameTitleTexture = this.assetLoader.getImage("game-title");
        this.gameTitle = new Layer("game-title", (this.game.window.innerWidth / 2) - gameTitleTexture.width / 2, 300, gameTitleTexture, this.game.renderer);

        const startButtonTexture = this.assetLoader.getImage("start-button");
        this.startButton = new Button({
            width: 216,
            height: 60,
            x: (this.game.window.innerWidth / 2) - startButtonTexture.width / 2,
            y: 476,
            texture: this.assetLoader.getImage("start-button")
        }, this.game.mouseInput, this.game.renderer);
        this.startButton.on("click", () => {
            this.assetLoader.getSound("menu-select").play();
            this.hideTitleScreen();
            this.showPlayerSelection();
        });
    }

    private hideTitleScreen() {
        this.gameTitle.hide();
        this.startButton.hide();
    }

    private showPlayerSelection() {
        const selectPlayerText = this.assetLoader.getImage("select-player-text");
        this.instruction = new Layer("select-player-text", (this.game.window.innerWidth / 2) - (selectPlayerText.width / 2), 300, selectPlayerText, this.game.renderer);

        const navGrid = new NavGrid({
            width: this.width,
            height: 672,
            x: 0,
            y: 1130
        }, this.game.renderer);

        const pathfinder = new PathFinder(navGrid, this.game.renderer);

        const groom = new Player({
            model: "groom",
            x: (this.game.window.innerWidth / 2) - 20,
            y: 1157
        }, this.assetLoader, this.game.renderer, pathfinder);

        const bride = new Player({
            model: "bride",
            x: (this.game.window.innerWidth / 2) + 20,
            y: 1157
        }, this.assetLoader, this.game.renderer, pathfinder);

        this.selectedPlayer = groom;

        const groomSelectionTexture = this.assetLoader.getImage("groom-player-selection");

        const selectionOffset = 100;

        this.groomSelection = new Button({
            width: 158,
            height: 158,
            x: (this.game.window.innerWidth / 2) - (groomSelectionTexture.width / 2) - selectionOffset,
            y: 340,
            texture: groomSelectionTexture
        }, this.game.mouseInput, this.game.renderer);
        this.groomSelection.on("click", () => {
            this.assetLoader.getSound("menu-select").play();
            this.selectedPlayer = groom;
        });

        const brideSelectionTexture = this.assetLoader.getImage("bride-player-selection");

        this.brideSelection = new Button({
            width: 158,
            height: 158,
            x: (this.game.window.innerWidth / 2) - (brideSelectionTexture.width / 2) + selectionOffset,
            y: 340,
            texture: brideSelectionTexture
        }, this.game.mouseInput, this.game.renderer);
        this.brideSelection.on("click", () => {
            this.assetLoader.getSound("menu-select").play();
            this.selectedPlayer = bride;
        });

        const playButtonTexture = this.assetLoader.getImage("play-button");
        this.playButton = new Button({
            width: 216,
            height: 60,
            x: (this.game.window.innerWidth / 2) - playButtonTexture.width / 2,
            y: 520,
            texture: this.assetLoader.getImage("play-button")
        }, this.game.mouseInput, this.game.renderer);

        this.playButton.on("click", () => {
            this.assetLoader.getSound("menu-select").play();
            this.startSequence();
        });

    }

    private hidePlayerSelectionScreen() {
        this.instruction.hide();
        this.groomSelection.hide();
        this.brideSelection.hide();
        this.playButton.hide();
    }

    private startSequence() {
        this.hidePlayerSelectionScreen();
        this.game.camera.moveTo({ x: 0, y: -1220 }, 4000, Easing.easeInOutCubic);
    }

}