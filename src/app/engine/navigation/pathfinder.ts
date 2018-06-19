import * as PF from "pathfinding";
import * as _ from "lodash";

import { NavGrid } from "./nav-grid";
import { Vector } from "../core/vector";
import { Renderer } from "../rendering/renderer";
import { MathsUtility } from "../utilities/maths";
import { ICoordinate } from "../core/core.models";
import { Rectangle } from "../game-objects/rectangle";
import { CollisionDetector } from "../detectors/collision-detector";

export enum PathFinderAlgorithm {
    None,
    AStarFinder
}

export class PathFinder {

    private finder: PF.Finder;
    private debugEnabled: boolean = false;
    constructor(public grid: NavGrid, private renderer: Renderer, private algorithm?: PathFinderAlgorithm) {
        this.algorithm = !algorithm ? PathFinderAlgorithm.AStarFinder : algorithm;
        this.setFinder(this.algorithm);
    }

    public findPath(from: ICoordinate, to: ICoordinate): Vector[] {
        const scaledDownFrom = new Vector(from.x, from.y).divide(this.grid.cellSize);
        const scaledDownTo = new Vector(to.x, to.y).divide(this.grid.cellSize);

        const path = this.finder.findPath(Math.floor(scaledDownFrom.x), Math.floor(scaledDownFrom.y), Math.floor(scaledDownTo.x), Math.floor(scaledDownTo.y), new PF.Grid(this.grid.generateBinaryMatrix()));
        if (path.length === 0) {
            throw new Error("No path found");
        }
        
        const scaledUpPath: Vector[] = [];
        for (const coord of path) {
            const vector = new Vector(coord[0], coord[1]);
            vector.multiplyBy(this.grid.cellSize);
            scaledUpPath.push(vector);
        }
        return scaledUpPath;
    }

    public getAvailableCoordinates() {
        return this.grid.getUnblockedCells();
    }

    public getCellClosestTo(coord: ICoordinate, includeBlocked?: boolean) {
        const minX = MathsUtility.roundDownToNearestMultiple(coord.x, this.grid.cellSize);
        const minY = MathsUtility.roundDownToNearestMultiple(coord.y, this.grid.cellSize);

        const cells = includeBlocked ? this.grid.getCells() : this.grid.getUnblockedCells();
        const closestCell = _.find(cells, d => d.x === minX && d.y === minY);
        return closestCell;
    }

    public getSurroundingCells(coord: ICoordinate, radius: number = 1, includeBlocked?: boolean) {
        const surroundingArea = this.getSurroundingArea(coord, radius, includeBlocked);
        const cells = includeBlocked ? this.grid.getCells()  : this.grid.getUnblockedCells()

        return _.chain(cells)
            .map(d => new Rectangle(this.grid.cellSize, this.grid.cellSize, d.x, d.y))
            .filter(d => CollisionDetector.hasCollision(d, surroundingArea))
            .map(d => this.getCellClosestTo({ x: d.x, y: d.y }, includeBlocked))
            .value();
    }

    public getSurroundingArea(coord: ICoordinate, radius: number = 1, includeBlocked?: boolean): Rectangle {
        const centerCell = this.getCellClosestTo(coord, true);
        const topLeftRadiusVect = new Vector(centerCell.x - (this.grid.cellSize  * radius), centerCell.y - (this.grid.cellSize * radius));
        if (topLeftRadiusVect.x < 0) {
            topLeftRadiusVect.x = 0;
        } else if (topLeftRadiusVect.x > this.grid.width) {
            topLeftRadiusVect.x = this.grid.width - this.grid.cellSize;
        }
        if (topLeftRadiusVect.y < 0) {
            topLeftRadiusVect.y = 0;
        } else if (topLeftRadiusVect.y > this.grid.height) {
            topLeftRadiusVect.y = this.grid.height - this.grid.cellSize;
        }

        let length: number = this.grid.cellSize * ((radius * 2) + 1);

        return new Rectangle(length, length, topLeftRadiusVect.x, topLeftRadiusVect.y);
    }

    public debug(enable: boolean) {
        this.debugEnabled = enable;
        this.grid.debug(enable);
    }

    private setFinder(algorithm: PathFinderAlgorithm): void {
        switch (algorithm) {
            case PathFinderAlgorithm.AStarFinder:
                this.finder = new PF.AStarFinder();
                break;
            default:
                throw new Error("Unsupported algorithm");
        }
    }

}