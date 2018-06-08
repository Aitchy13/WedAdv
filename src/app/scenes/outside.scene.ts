import * as _ from "lodash";

import { Scene } from "../engine/game-objects/scene";
import { Game } from "../engine/game-objects/game";
import { Rectangle } from "../engine/game-objects/rectangle";
import { Vector } from "../engine/core/vector";
import { AssetLoader } from "../engine/textures/asset-loader";
import { NavGrid } from "../engine/navigation/nav-grid";
import { PathFinder } from "../engine/navigation/pathfinder";
import { Easing } from "../engine/animation/easing";
import { Layer } from "../engine/rendering/layer";
import { Player } from "../models/player";
import { Button } from "../engine/ui/button";
import { Sound } from "../engine/audio/sound";
import { IRenderable } from "../engine/rendering/renderer";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { InsideScene } from "./inside.scene";
import { Tween } from "../engine/animation/tween";

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
    private groom: Player;
    private bride: Player;

    private menuSelectSound: Sound;

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.assetLoader.loadImage("outdoor-scene-background", "src/sprites/outdoor-scene.png"),
            this.assetLoader.loadImage("cloud-1", "src/sprites/cloud-1.png"),
            this.assetLoader.loadImage("cloud-2", "src/sprites/cloud-2.png"),
            this.assetLoader.loadImage("game-title", "src/sprites/game-title.png"),
            this.assetLoader.loadImage("select-player-text", "src/sprites/select-player-text.png"),
            this.assetLoader.loadImage("groom-player-selection", "src/sprites/groom-player-selection.png"),
            this.assetLoader.loadImage("bride-player-selection", "src/sprites/bride-player-selection.png"),
            this.assetLoader.loadImage("start-button", "src/sprites/start-button.png"),
            this.assetLoader.loadImage("play-button", "src/sprites/play-button.png"),
            this.assetLoader.loadImage("wedding-arch", "src/sprites/wedding-arch.png"),
            this.assetLoader.loadImage("pew", "src/sprites/pew.png"),
        ] as any);
    }

    public render() {
        const sky = new Rectangle(this.width, 934, 0, 0);
        sky.gradient = [["#b1e0f2", 1], ["#7d9bf2", 0]];

        new Layer("sky", 0, 0, sky, this.game.rootRenderer);
        new Layer("outdoor-scene", 0, 850, this.assetLoader.getImage("outdoor-scene-background"), this.game.rootRenderer);

        const durationModifier = 2;
        const cloudA = new Layer("cloud-a", 430, 190, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        const cloudATween = new Tween(cloudA).to(new Vector(470, 190), 8000 * durationModifier, Easing.linear).yoyo().repeat();
        cloudATween.start();

        const cloudB = new Layer("cloud-b", 360, 82, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudBTween = new Tween(cloudB).to(new Vector(410, 82), 7900 * durationModifier, Easing.linear).yoyo().repeat();
        cloudBTween.start();

        const cloudC = new Layer("cloud-c", 793, 55, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudCTween = new Tween(cloudC).to(new Vector(820, 55), 8100 * durationModifier, Easing.linear).yoyo().repeat();
        cloudCTween.start();

        const cloudD = new Layer("cloud-d", 860, 210, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudDTween = new Tween(cloudD).to(new Vector(910, 210), 8300 * durationModifier, Easing.linear).yoyo().repeat();
        cloudDTween.start();

        const cloudE = new Layer("cloud-e", 1232, 248, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudETween = new Tween(cloudE).to(new Vector(1250, 248), 7950 * durationModifier, Easing.linear).yoyo().repeat();
        cloudETween.start();

        const cloudF = new Layer("cloud-f", 1093, 431, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        const cloudFTween = new Tween(cloudF).to(new Vector(1150, 431), 7800 * durationModifier, Easing.linear).yoyo().repeat();
        cloudFTween.start();

        const cloudG = new Layer("cloud-g", 1223, 620, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudGTween = new Tween(cloudG).to(new Vector(1280, 620), 8000 * durationModifier, Easing.linear).yoyo().repeat();
        cloudGTween.start();

        const cloudH = new Layer("cloud-h", 353, 500, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudHTween = new Tween(cloudH).to(new Vector(400, 500), 8100 * durationModifier, Easing.linear).yoyo().repeat();
        cloudHTween.start();

        const cloudI = new Layer("cloud-i", 100, 575, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        const cloudITween = new Tween(cloudI).to(new Vector(140, 575), 8200 * durationModifier, Easing.linear).yoyo().repeat();
        cloudITween.start();

        const cloudJ = new Layer("cloud-j", 184, 380, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudJTween = new Tween(cloudJ).to(new Vector(200, 380), 8400, Easing.easeInOutCubic).yoyo().repeat();
        cloudJTween.start();

        this.game.camera.setBoundaries(0, this.width, 0, this.height);

        this.showTitleScreen();
    }

    public destroy() {
        this.game.rootRenderer.removeAllObjects();
    }

    private showTitleScreen() {
        const gameTitleTexture = this.assetLoader.getImage("game-title");
        this.gameTitle = new Layer("game-title", (this.game.window.innerWidth / 2) - gameTitleTexture.width / 2, 300, gameTitleTexture, this.game.rootRenderer);

        const startButtonTexture = this.assetLoader.getImage("start-button");
        this.startButton = new Button({
            width: 216,
            height: 60,
            x: (this.game.window.innerWidth / 2) - startButtonTexture.width / 2,
            y: 476,
            texture: this.assetLoader.getImage("start-button")
        }, this.game.mouseInput, this.game.rootRenderer);
        this.menuSelectSound = this.assetLoader.getSound("menu-select");
        this.menuSelectSound.load();
        this.startButton.on("click", () => {
            this.menuSelectSound.play();
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
        this.instruction = new Layer("select-player-text", (this.game.window.innerWidth / 2) - (selectPlayerText.width / 2), 300, selectPlayerText, this.game.rootRenderer);

        const navGrid = new NavGrid({
            width: this.width,
            height: 672,
            x: 0,
            y: 1130
        }, this.game.rootRenderer);

        const pathfinder = new PathFinder(navGrid, this.game.rootRenderer);

        this.groom = new Player({
            model: "groom",
            x: (this.game.window.innerWidth / 2) - 20,
            y: 1157
        }, this.assetLoader, this.game.rootRenderer, pathfinder, this.game.keyboardInput);

        this.bride = new Player({
            model: "bride",
            x: (this.game.window.innerWidth / 2) + 20,
            y: 1157
        }, this.assetLoader, this.game.rootRenderer, pathfinder, this.game.keyboardInput);

        this.selectedPlayer = this.groom;

        const groomSelectionTexture = this.assetLoader.getImage("groom-player-selection");

        const selectionOffset = 100;

        this.groomSelection = new Button({
            width: 158,
            height: 158,
            x: (this.game.window.innerWidth / 2) - (groomSelectionTexture.width / 2) - selectionOffset,
            y: 340,
            texture: groomSelectionTexture
        }, this.game.mouseInput, this.game.rootRenderer);
        this.groomSelection.on("click", () => {
            this.menuSelectSound.play();
            this.selectedPlayer = this.groom;
        });

        const brideSelectionTexture = this.assetLoader.getImage("bride-player-selection");

        this.brideSelection = new Button({
            width: 158,
            height: 158,
            x: (this.game.window.innerWidth / 2) - (brideSelectionTexture.width / 2) + selectionOffset,
            y: 340,
            texture: brideSelectionTexture
        }, this.game.mouseInput, this.game.rootRenderer);
        this.brideSelection.on("click", () => {
            this.menuSelectSound.play();
            this.selectedPlayer = this.bride;
        });

        const playButtonTexture = this.assetLoader.getImage("play-button");
        this.playButton = new Button({
            width: 216,
            height: 60,
            x: (this.game.window.innerWidth / 2) - playButtonTexture.width / 2,
            y: 520,
            texture: this.assetLoader.getImage("play-button")
        }, this.game.mouseInput, this.game.rootRenderer);

        this.playButton.on("click", () => {
            this.menuSelectSound.play();
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
        this.renderLevel();
        

        this.game.camera.moveTo(this.selectedPlayer, 4000, Easing.easeInOutCubic).then(() => {
            this.game.camera.follow(() => {
                return new Vector(this.selectedPlayer.x, this.selectedPlayer.y);
            });
            this.beginCeremony();
        });
    }

    private renderLevel() {
        const arch = new Layer("wedding-arch", 665, 1067, this.assetLoader.getImage("wedding-arch"), this.game.rootRenderer);

        const firstRowY = 1214;
        const rightSectionSpacing = 605;
        const spacing = 70;
        new Layer("pew-a", 223, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-b", 414, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-c", 223, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-d", 414, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-e", 223, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-f", 414, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-g", 223, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-h", 414, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-i", 223, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-j", 414, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);

        new Layer("pew-h", 223 + rightSectionSpacing, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-k", 414 + rightSectionSpacing, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-l", 223 + rightSectionSpacing, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-m", 414 + rightSectionSpacing, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-n", 223 + rightSectionSpacing, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-o", 414 + rightSectionSpacing, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-p", 223 + rightSectionSpacing, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-q", 414 + rightSectionSpacing, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-r", 223 + rightSectionSpacing, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-s", 414 + rightSectionSpacing, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);

        const exit = new Rectangle(150, 2, (this.width / 2) - 150 / 2, this.height - 2);
        exit.beforeRender = () => {
            if (CollisionDetector.hasCollision(this.selectedPlayer, exit)) {
                this.game.sceneManager.load(InsideScene);
                this.game.cache.addItem("player", this.selectedPlayer);
            }
        };
        this.game.rootRenderer.addObject(exit);

        const topBoundary = new Rectangle(this.width, 50, 0, 1050);
        this.selectedPlayer.addCollidable(topBoundary);
        this.game.rootRenderer.addObject(topBoundary);
    }

    private beginCeremony() {
        const dialogText = "Hello this is text to see if blah blah blah something long goes here. It'll fill a lot of space to test the text. And this is another snippet to show how the text snippet stuff works."
        this.game.dialogService.show(dialogText, this.groom).then(() => {
            return this.game.dialogService.show("Hey, I' talking to you. Stop testing out shit!", this.bride);
        }).then(() => {
            this.selectedPlayer.enableControls();
        });
    }

}