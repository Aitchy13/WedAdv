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

export class InsideScene extends Scene {

    public width: number = 1440;
    public height: number = 960;

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.assetLoader.loadImage("indoor-scene-background", "src/sprites/indoor-scene.png"),
            this.assetLoader.loadSpriteSheet("male-guest-blue", "src/sprites/male-guest-blue.png", "src/sprites/male-guest-blue.json"),
            this.assetLoader.loadSpriteSheet("bride", "src/sprites/bride.png", "src/sprites/bride.json"),
            this.assetLoader.loadSpriteSheet("groom", "src/sprites/groom.png", "src/sprites/groom.json"),
            this.assetLoader.loadImage("indoor-table", "src/sprites/indoor-table.png")
        ]);
    }

    public render() {
        const navGrid = new NavGrid({
            width: this.width,
            height: this.height
        }, this.game.renderer);

        const pathfinder = new PathFinder(navGrid, this.game.renderer);

        const hidingSpots = [];

        const player = new Player({
            model: "groom",
            x: 650,
            y: 300
        }, this.assetLoader, this.game.renderer, pathfinder);

        this.game.camera.setBoundaries(-this.width, 0, -this.height, 0);
        this.game.camera.follow(() => {
            return new Vector(player.x, player.y);
        });

        new Layer("background", 0, 0, this.assetLoader.getImage("indoor-scene-background"), this.game.renderer);
            
        const tableWidth = 154;
        const tableHeight = 142;

        const table1 = new Rectangle(tableWidth, tableHeight, 120, 400);
        table1.key = "table1";
        table1.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table1);

        const table2 = new Rectangle(tableWidth, tableHeight, 120, 650);
        table2.key = "table2";
        table2.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table2);

        const table3 = new Rectangle(tableWidth, tableHeight, 460, 400);
        table3.key = "table3";
        table3.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table3);

        const table4 = new Rectangle(tableWidth, tableHeight, 460, 650);
        table4.key = "table4";
        table4.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table4);

        const table5 = new Rectangle(tableWidth, tableHeight, 820, 400);
        table5.key = "table5";
        table5.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table5);

        const table6 = new Rectangle(tableWidth, tableHeight, 820, 650);
        table6.key = "table6";
        table6.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table6);

        const topWallBoundary = new Rectangle(this.width, 200, 0, 0);
        navGrid.addBlockedGeometry("top-wall", topWallBoundary);

        new Guest({
            name: "James Aitchison",
            clothing: "blue-suit",
            x: 200,
            y: 200
        }, this.assetLoader, this.game.renderer, pathfinder);

        new Guest({
            name: "Some Guest",
            clothing: "blue-suit",
            x: 500,
            y: 550
        }, this.assetLoader, this.game.renderer, pathfinder);

        new Guest({
            name: "Another Guest",
            clothing: "blue-suit",
            x: 700,
            y: 700
        }, this.assetLoader, this.game.renderer, pathfinder);


        const hiddenLocation = hidingSpots[MathsUtility.randomIntegerRange(0, hidingSpots.length - 1)];

        const target = new Target({
            name: "Noah",
            x: hiddenLocation.x,
            y: hiddenLocation.y,
            player: player,
            hidingSpots: hidingSpots
        }, this.assetLoader, this.game.renderer, pathfinder);

        let revealed = false;
        hidingSpots.forEach(hideableLocation => {
            hideableLocation.beforeRender = () => {
                this.stopObjectOnCollision(player, hideableLocation);
            }
            navGrid.addBlockedGeometry(hideableLocation.key, hideableLocation);
            this.game.renderer.addObject(hideableLocation);
        });
        
        this.game.renderer.addObject(player);

        const walkSound = new Sound("footstep", "src/sounds/footstep10.wav");
        walkSound.load();

        this.game.keyboardInput.onKeyDown(evt => {
            const sensitivity = 2.5;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    player.setVelocity(AxisDimension.Y, -sensitivity);
                    player.defaultSpriteFrame = "north-stand";
                    player.spriteSheet.playAnimation("walk-north");
                    walkSound.loop();
                    break;
                case "s":
                case "ArrowDown":
                    player.setVelocity(AxisDimension.Y, sensitivity);
                    player.defaultSpriteFrame = "south-stand";
                    player.spriteSheet.playAnimation("walk-south");
                    walkSound.loop();
                    break;
                case "a":
                case "ArrowLeft":
                    player.setVelocity(AxisDimension.X, -sensitivity);
                    player.defaultSpriteFrame = "west-stand";
                    player.spriteSheet.playAnimation("walk-west");
                    walkSound.loop();
                    break;
                case "d":
                case "ArrowRight":
                    player.setVelocity(AxisDimension.X, sensitivity);
                    player.defaultSpriteFrame = "east-stand";
                    player.spriteSheet.playAnimation("walk-east");
                    walkSound.loop();
                    break;
            }
        });
        this.game.keyboardInput.onKeyUp(evt => { 
            player.setVelocity(AxisDimension.XY, 0);
            player.spriteSheet.stopAnimation();
            walkSound.stop();
        });

        // pathfinder.debug(true);
    }

    private stopObjectOnCollision(objectToStop: any, current: any): void {
        const hasCollision = CollisionDetector.hasCollision(current, objectToStop);
        if (hasCollision) {
            const currentXVel = objectToStop.xVel < 0 ? 5 : -5;
            const currentYVel = objectToStop.yVel < 0 ? 5 : -5;
            objectToStop.setVelocity(AxisDimension.XY, 0);
            objectToStop.move(currentXVel, currentYVel, PositionStrategy.Relative);
        }
    }


    private getNearestGridCell(x: number, y: number, cellSize: number) {
        // TODO: WIP - need a system that will map rectangle coords to a 20x20 map
        // this.game.logger.log(MathsUtility.roundToNearestMultiple(x, cellSize), MathsUtility.roundToNearestMultiple(y, cellSize))
    }

}