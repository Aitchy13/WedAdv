import * as PF from "pathfinding";

import { NavGrid } from "./nav-grid";
import { Vector } from "../core/vector";
import { Renderer } from "../rendering/renderer";

export enum PathFinderAlgorithm {
    None,
    AStarFinder
}

export class PathFinder {

    private finder: PF.Finder;
    private debugEnabled: boolean = false;

    constructor(private grid: NavGrid, private renderer: Renderer, private algorithm?: PathFinderAlgorithm) {
        this.algorithm = !algorithm ? PathFinderAlgorithm.AStarFinder : algorithm;
        this.setFinder(this.algorithm);
    }

    public findPath(from: Vector, to: Vector): Vector[] {
        const scaledDownFrom = from.divide(this.grid.cellSize);
        const scaledDownTo = to.divide(this.grid.cellSize);

        const path = this.finder.findPath(Math.floor(scaledDownFrom.x), Math.floor(scaledDownFrom.y), Math.floor(scaledDownTo.x), Math.floor(scaledDownTo.y), new PF.Grid(this.grid.generateBinaryMatrix()));
        if (path.length < 2) {
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