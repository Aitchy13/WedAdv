import * as _ from "lodash";

import { Scene } from "../engine/game-objects/scene";
import { Shape} from "../engine/game-objects/shape";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Rectangle } from "../engine/game-objects/rectangle";
import { AxisDimension, PositionStrategy } from "../engine/physics/moveable";
import { Vector } from "../engine/core/vector";
import { TextureLoader } from "../engine/textures/texture-loader";
import { SpriteSheet } from "../engine/textures/sprite-texture";
import { IRenderMiddleware } from "../engine/rendering/frame-renderer";
import { MathsUtility } from "../engine/utilities/maths";
import { NavGrid } from "../engine/navigation/nav-grid";
import { PathFinder } from "../engine/navigation/pathfinder";
import { Tween } from "../engine/animation/tween";
import { Easing } from "../engine/animation/easing";
import { Layer } from "../engine/rendering/layer";
import { Guest } from "../models/guest";
import { Sound } from "../engine/audio/sound";

export class InsideScene extends Scene {

    public width: number = 1440;
    public height: number = 960;

    constructor(private readonly game: Game, private readonly textureLoader: TextureLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.textureLoader.loadImage("indoor-scene-background", "src/sprites/indoor-scene.png"),
            this.textureLoader.loadSpriteSheet("male-guest-blue", "src/sprites/male-guest-blue.png", "src/sprites/male-guest-blue.json"),
            this.textureLoader.loadSpriteSheet("bride", "src/sprites/bride.png", "src/sprites/bride.json"),
            this.textureLoader.loadImage("indoor-table", "src/sprites/indoor-table.png")
        ]);
    }

    public render() {
        const player = new Rectangle(39, 75, 650, 300);
        player.spriteKey = "south-stand";

        player.spriteSheet = this.textureLoader.getSpriteSheet("bride");
        player.spriteSheet.addAnimation("walk-south", [
            "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm", "south-left-arm",
            "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm", "south-right-arm"], true);
        player.spriteSheet.addAnimation("walk-north", [
            "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm", "north-left-arm",
            "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm", "north-right-arm"], true);
        player.spriteSheet.addAnimation("walk-east", [
            "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm", "east-left-arm",
            "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm", "east-right-arm"], true);
        player.spriteSheet.addAnimation("walk-west", [
            "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm", "west-left-arm",
            "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm", "west-right-arm"], true);

        

        const hideableLocations = [];

        this.game.camera.setBoundaries(-this.width, 0, -this.height, 0);
        this.game.camera.follow(player.origin);

        this.game.renderer.addObject(new Layer("background", 0, 0, this.textureLoader.getImage("indoor-scene-background")));

        const navGrid = new NavGrid({
            width: this.width,
            height: this.height
        });

        const pathfinder = new PathFinder(navGrid);
            
        const tableWidth = 154;
        const tableHeight = 142;

        const table1 = new Rectangle(tableWidth, tableHeight, 200, 400);
        table1.key = "table1";
        table1.imageTexture = this.textureLoader.getImage("indoor-table");
        hideableLocations.push(table1);

        const table2 = new Rectangle(tableWidth, tableHeight, 200, 650);
        table2.key = "table2";
        table2.imageTexture = this.textureLoader.getImage("indoor-table");
        hideableLocations.push(table2);

        const table3 = new Rectangle(tableWidth, tableHeight, 550, 400);
        table3.key = "table3";
        table3.imageTexture = this.textureLoader.getImage("indoor-table");
        hideableLocations.push(table3);

        const table4 = new Rectangle(tableWidth, tableHeight, 550, 650);
        table4.key = "table4";
        table4.imageTexture = this.textureLoader.getImage("indoor-table");
        hideableLocations.push(table4);

        const table5 = new Rectangle(tableWidth, tableHeight, 900, 400);
        table5.key = "table5";
        table5.imageTexture = this.textureLoader.getImage("indoor-table");
        hideableLocations.push(table5);

        const table6 = new Rectangle(tableWidth, tableHeight, 900, 650);
        table6.key = "table6";
        table6.imageTexture = this.textureLoader.getImage("indoor-table");
        hideableLocations.push(table6);

        const topWallBoundary = new Rectangle(this.width, 200, 0, 0);
        navGrid.addBlockedGeometry("top-wall", topWallBoundary);

        new Guest({
            name: "James Aitchison",
            clothing: "blue-suit",
            x: 200,
            y: 200
        }, this.textureLoader, this.game.renderer, pathfinder);

        new Guest({
            name: "Some Guest",
            clothing: "blue-suit",
            x: 500,
            y: 500
        }, this.textureLoader, this.game.renderer, pathfinder);

        new Guest({
            name: "Another Guest",
            clothing: "blue-suit",
            x: 700,
            y: 700
        }, this.textureLoader, this.game.renderer, pathfinder);


        const hiddenLocation = hideableLocations[MathsUtility.randomIntegerRange(0, hideableLocations.length - 1)];

        const target = new Rectangle(15, 15, hiddenLocation.origin.x, hiddenLocation.origin.y);
        target.color = "pink";
        target.key = "target";

        let caught = false;
        target.beforeRender = () => {
            if (!caught && CollisionDetector.rectangleHasCollision(player, target as Rectangle)) {
                target.setVelocity(AxisDimension.XY, 0);
                alert("You caught Noah!");
            }
        }
        this.game.renderer.addObject(target);

        let revealed = false;
        hideableLocations.forEach(hideableLocation => {
            hideableLocation.beforeRender = () => {
                if (hiddenLocation === hideableLocation && !revealed && CollisionDetector.rectangleHasCollision(player, hideableLocation)) {
                    revealed = true;
                    target.move(0, -20, PositionStrategy.Relative);
                    this.runAway(target, pathfinder);
                }
                this.stopObjectOnCollision(player, hideableLocation);
            }
            navGrid.addBlockedGeometry(hideableLocation.key, hideableLocation);
            this.game.renderer.addObject(hideableLocation);
        });
        
        this.game.renderer.addObject(player);

        const walkSound = new Sound("src/sounds/footstep10.wav");
        walkSound.load();

        this.game.keyboardInput.onKeyDown(evt => {
            const sensitivity = 2.5;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    player.setVelocity(AxisDimension.Y, -sensitivity);
                    player.spriteKey = "north-stand";
                    player.spriteSheet.playAnimation("walk-north");
                    walkSound.loop();
                    break;
                case "s":
                case "ArrowDown":
                    player.setVelocity(AxisDimension.Y, sensitivity);
                    player.spriteKey = "south-stand";
                    player.spriteSheet.playAnimation("walk-south");
                    walkSound.loop();
                    break;
                case "a":
                case "ArrowLeft":
                    player.setVelocity(AxisDimension.X, -sensitivity);
                    player.spriteKey = "west-stand";
                    player.spriteSheet.playAnimation("walk-west");
                    walkSound.loop();
                    break;
                case "d":
                case "ArrowRight":
                    player.setVelocity(AxisDimension.X, sensitivity);
                    player.spriteKey = "east-stand";
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
        // this.game.mouseInput.onClick(evt => {
        //     this.game.logger.log(evt.event.offsetX, evt.event.offsetY);
        //     this.getNearestGridCell(evt.event.offsetX, evt.event.offsetY, cellSize);
        // });
    }

    private stopObjectOnCollision(objectToStop: Rectangle, current: Rectangle): void {
        const hasCollision = CollisionDetector.rectangleHasCollision(current, objectToStop);
        if (hasCollision) {
            const currentXVel = objectToStop.xVel < 0 ? 5 : -5;
            const currentYVel = objectToStop.yVel < 0 ? 5 : -5;
            objectToStop.setVelocity(AxisDimension.XY, 0);
            objectToStop.move(currentXVel, currentYVel, PositionStrategy.Relative);
        }
    }

    private runAway(target: Rectangle, pathFinder: PathFinder) {
        const unblockedCells = pathFinder.getAvailableCoordinates();
        const randomAvailableCell = unblockedCells[MathsUtility.randomIntegerRange(0, unblockedCells.length - 1)];
        const path = pathFinder.findPath(target.origin, new Vector(randomAvailableCell.x, randomAvailableCell.y));
        target.movePath(path, 100, undefined, () => {
            this.runAway(target, pathFinder);
        });
    }


    private getNearestGridCell(x: number, y: number, cellSize: number) {
        // TODO: WIP - need a system that will map rectangle coords to a 20x20 map
        // this.game.logger.log(MathsUtility.roundToNearestMultiple(x, cellSize), MathsUtility.roundToNearestMultiple(y, cellSize))
    }

}