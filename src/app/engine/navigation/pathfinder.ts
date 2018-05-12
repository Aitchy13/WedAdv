import * as PF from "pathfinding";

import { NavGrid } from "./nav-grid";
import { Vector } from "../core/vector";

export enum PathFinderAlgorithm {
    None,
    AStarFinder
}

export class PathFinder {

    private finder: PF.Finder;

    constructor(private grid: NavGrid, private algorithm?: PathFinderAlgorithm) {
        this.algorithm = !algorithm ? PathFinderAlgorithm.AStarFinder : algorithm;
        this.setFinder(this.algorithm);
    }

    public findPath(from: Vector, to: Vector): Vector[] {
        const scaledDownFrom = from.divide(this.grid.cellSize);
        const scaledDownTo = to.divide(this.grid.cellSize);

        const path = this.finder.findPath(scaledDownFrom.x, scaledDownFrom.y, scaledDownTo.x, scaledDownTo.y, new PF.Grid(this.grid.generateBinaryMatrix()));
        
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