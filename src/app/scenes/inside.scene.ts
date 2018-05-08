import * as _ from "lodash";

import { Scene } from "../engine/game-objects/scene";
import { Shape} from "../engine/game-objects/shape";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Rectangle } from "../engine/game-objects/rectangle";
import { AxisDimension, PositionStrategy } from "../engine/physics/moveable";
import { Vector } from "../engine/game-objects/vector";
import { TextureLoader } from "../engine/textures/texture-loader";
import { SpriteSheetTexture } from "../engine/textures/sprite-texture";
import { IRenderMiddleware } from "../engine/rendering/frame-renderer";
import { MathsUtility } from "../engine/utilities/maths";

export class InsideScene extends Scene {

    private spriteSheets: SpriteSheetTexture[];

    constructor(private readonly game: Game, private readonly textureLoader: TextureLoader) {
        super();
    }

    public render() {
        const player = new Rectangle(20, 30, 200, 200);
        player.color = "red";

        const hideableLocations = [];
        
        const cellSize: number = 20;
        const gridLineColor: string = "#dcdcdc";
        const gridLineThickness: number = 1;
        const minCols = Math.ceil(this.game.config.width / cellSize);
        const minRows = Math.ceil(this.game.config.height / cellSize);

        const gridRows: Rectangle[] = _.chain(_.range(minRows))
            .map(i => {
                const line = new Rectangle(this.game.config.width, gridLineThickness, 0, i * cellSize);
                line.color = gridLineColor;
                return line;
            })
            .each(x => this.game.renderer.addObject(x))
            .value();
        const gridCols: Rectangle[] = _.chain(_.range(minCols))
            .map(i => {
                const line = new Rectangle(gridLineThickness, this.game.config.height, i * cellSize, 0);
                line.color = gridLineColor;
                return line;
            })
            .each(x => this.game.renderer.addObject(x))
            .value();
            
        const tableWidth = 80;
        const tableHeight = 80;

        const table1 = new Rectangle(tableWidth, tableHeight, 100, 100);
        table1.color = "blue";
        hideableLocations.push(table1);
        this.game.renderer.addObject(table1, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const table2 = new Rectangle(tableWidth, tableHeight, 240, 100);
        table2.color = "blue";
        hideableLocations.push(table2);
        this.game.renderer.addObject(table2, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const table3 = new Rectangle(tableWidth, tableHeight, 380, 100);
        table3.color = "blue";
        hideableLocations.push(table3);
        this.game.renderer.addObject(table3, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const table4 = new Rectangle(tableWidth, tableHeight, 100, 240);
        table4.color = "blue";
        hideableLocations.push(table4);
        this.game.renderer.addObject(table4, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const table5 = new Rectangle(tableWidth, tableHeight, 240, 240);
        table5.color = "blue";
        hideableLocations.push(table5);
        this.game.renderer.addObject(table5, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const table6 = new Rectangle(tableWidth, tableHeight, 380, 240);
        table6.color = "blue";
        hideableLocations.push(table6);
        this.game.renderer.addObject(table6, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const cakeTable = new Rectangle(tableWidth, 60, 240, 0);
        cakeTable.color = "blue";
        hideableLocations.push(cakeTable);
        this.game.renderer.addObject(cakeTable, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const exit = new Rectangle(20, 160, 580, 120);
        exit.color = "green";
        this.game.renderer.addObject(exit, {
            beforeRender: [
                (next: Function, current: any) => {
                    this.stopObjectOnCollision(player, current);
                    next(current);
                }
            ]
        });

        const randomLocation = hideableLocations[MathsUtility.randomIntegerRange(0, hideableLocations.length)];
        const target = new Rectangle(15, 15, randomLocation.origin.x, randomLocation.origin.y);
        target.color = "pink";
        this.game.renderer.addObject(target);
        
        this.game.renderer.addObject(player);

        this.game.keyboardInput.onKeyDown(evt => {
            const sensitivity = 4;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    player.setVelocity(AxisDimension.Y, -sensitivity);
                    player.spriteKey = "stand-face-up";
                    break;
                case "s":
                case "ArrowDown":
                    player.setVelocity(AxisDimension.Y, sensitivity);
                    player.spriteKey = "stand-face-down";
                    break;
                case "a":
                case "ArrowLeft":
                    player.setVelocity(AxisDimension.X, -sensitivity);
                    player.spriteKey = "stand-face-left";
                    break;
                case "d":
                case "ArrowRight":
                    player.setVelocity(AxisDimension.X, sensitivity);
                    player.spriteKey = "stand-face-right";
                    break;
            }
        });
        this.game.keyboardInput.onKeyUp(evt => {
            player.setVelocity(AxisDimension.XY, 0);
        });
        this.game.mouseInput.onClick(evt => {
            this.game.logger.log(evt.event.offsetX, evt.event.offsetY);
            this.getNearestGridCell(evt.event.offsetX, evt.event.offsetY, cellSize);
        });
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

    private getNearestGridCell(x: number, y: number, cellSize: number) {
        // TODO: WIP - need a system that will map rectangle coords to a 20x20 map
        this.game.logger.log(MathsUtility.roundToNearestMultiple(x, cellSize), MathsUtility.roundToNearestMultiple(y, cellSize))
    }

}