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

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.assetLoader.loadImage("outdoor-scene-background", "src/sprites/outdoor-scene.png"),
            this.assetLoader.loadSpriteSheet("male-guest-blue", "src/sprites/male-guest-blue.png", "src/sprites/male-guest-blue.json"),
            this.assetLoader.loadSpriteSheet("bride", "src/sprites/bride.png", "src/sprites/bride.json"),
            this.assetLoader.loadSpriteSheet("groom", "src/sprites/groom.png", "src/sprites/groom.json"),
            this.assetLoader.loadSpriteSheet("groom-dialog", "src/sprites/groom-dialog.png", "src/sprites/groom-dialog.json"),
            this.assetLoader.loadImage("cloud-1", "src/sprites/cloud-1.png"),
            this.assetLoader.loadImage("cloud-2", "src/sprites/cloud-2.png"),
            this.assetLoader.loadImage("game-title", "src/sprites/game-title.png"),
            this.assetLoader.loadImage("select-player-text", "src/sprites/select-player-text.png"),
            this.assetLoader.loadImage("groom-player-selection", "src/sprites/groom-player-selection.png"),
            this.assetLoader.loadImage("bride-player-selection", "src/sprites/bride-player-selection.png"),
            this.assetLoader.loadImage("start-button", "src/sprites/start-button.png"),
            this.assetLoader.loadImage("play-button", "src/sprites/play-button.png"),
            this.assetLoader.loadSound("menu-select", "src/sounds/menu-select.wav"),
            this.assetLoader.loadImage("wedding-arch", "src/sprites/wedding-arch.png"),
            this.assetLoader.loadImage("pew", "src/sprites/pew.png"),
            this.assetLoader.loadImage("dialog", "src/sprites/dialog.png"),
            this.assetLoader.loadImage("dialog-arrow", "src/sprites/dialog-arrow.png")
        ] as any);
    }

    public render() {
        const sky = new Rectangle(this.width, 934, 0, 0);
        sky.gradient = [["#b1e0f2", 1], ["#7d9bf2", 0]];

        new Layer("sky", 0, 0, sky, this.game.rootRenderer);
        new Layer("outdoor-scene", 0, 850, this.assetLoader.getImage("outdoor-scene-background"), this.game.rootRenderer);

        new Layer("cloud-a", 430, 190, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        new Layer("cloud-b", 360, 82, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        new Layer("cloud-c", 793, 55, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        new Layer("cloud-d", 860, 210, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        new Layer("cloud-e", 1232, 248, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        new Layer("cloud-f", 1093, 431, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        new Layer("cloud-g", 1223, 620, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        new Layer("cloud-h", 353, 500, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        new Layer("cloud-i", 100, 575, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        new Layer("cloud-j", 184, 380, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);

        this.game.camera.setBoundaries(0, this.width, 0, this.height);

        this.showTitleScreen();
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
            this.assetLoader.getSound("menu-select").play();
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
            this.assetLoader.getSound("menu-select").play();
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

        const arch = new Layer("wedding-arch", 665, 1067, this.assetLoader.getImage("wedding-arch"), this.game.rootRenderer);

        this.game.camera.moveTo(this.selectedPlayer, 4000, Easing.easeInOutCubic).then(() => {
            this.game.camera.follow(() => {
                return new Vector(this.selectedPlayer.x, this.selectedPlayer.y);
            });
            this.beginCeremony();
        });

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
    }

    private beginCeremony() {
        const dialogText = "Hello this is text to see if blah blah blah something long goes here. It'll fill a lot of space to test the text. And this is another snippet to show how the text snippet stuff works."
        this.game.dialogService.show(dialogText, this.groom);
    }

}