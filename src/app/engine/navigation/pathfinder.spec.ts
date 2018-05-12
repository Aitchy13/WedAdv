import { PathFinder } from "./pathfinder";
import { NavGrid } from "./nav-grid";
import { Vector } from "../core/vector";
import { Rectangle } from "../game-objects/rectangle";

describe("PathFinder", () => {

    let pathFinder: PathFinder;
    let grid: NavGrid;

    beforeEach(() => {
        pathFinder = undefined;
        grid = new NavGrid({
            width: 10,
            height: 10
        });
        grid.cellSize = 1;
    });

    it("should find the correct path", () => {
        const width = 1;
        const height = 1;
        grid.addBlockedGeometry("mid-left", new Rectangle(width, height, 0, 1));
        grid.addBlockedGeometry("top-right", new Rectangle(width, height, 3, 0));
        grid.addBlockedGeometry("bottom-mid", new Rectangle(width, height, 2, 2));
        grid.addBlockedGeometry("right-mid", new Rectangle(width, height, 4, 1));

        pathFinder = new PathFinder(grid);
        expect(pathFinder.findPath(new Vector(1, 2), new Vector(4, 2))).toEqual([new Vector(1, 2), new Vector(1, 1), new Vector(2, 1), new Vector(3, 1), new Vector(3, 2), new Vector(4, 2)]);
    });

});