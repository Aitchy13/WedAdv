import { NavGrid } from "./nav-grid";
import { Rectangle } from "../game-objects/rectangle";
import { Renderer } from "../rendering/renderer";

describe("Navigation grid", () => {

    let grid: NavGrid;

    beforeEach(() => {
        // grid = new NavGrid({
        //     width: 30,
        //     height: 30,
        //     cellSize: 10
        // }, new Renderer());
    });

    // it ("must generate a grid properly", () => {
    //     const testRectangle = new Rectangle(5, 5, 8, 8);
    //     const key = "rect";
    //     grid.addBlockedGeometry(key, testRectangle);
    //     const generatedGrid = grid.generate();
    //     expect(generatedGrid).toEqual([
    //         [{blockedBy: key, y: 0, x: 0, matrixCoords:[0, 0]}, {blockedBy: key, y: 0, x: 10, matrixCoords:[0, 1]}, {blockedBy: undefined, y: 0, x: 20, matrixCoords:[0, 2]}],
    //         [{blockedBy: key, y: 10, x: 0, matrixCoords:[1, 0]}, {blockedBy: key, y: 10, x: 10, matrixCoords:[1, 1]}, {blockedBy: undefined, y: 10, x: 20, matrixCoords:[1, 2]}],
    //         [{blockedBy: undefined, y: 20, x: 0, matrixCoords:[2, 0]}, {blockedBy: undefined, y: 20, x: 10, matrixCoords:[2, 1]}, {blockedBy: undefined, y: 20, x: 20, matrixCoords:[2, 2]}]
    //     ]);
    // });

    // it ("must generate a binary grid properly", () => {
    //     const testRectangle = new Rectangle(5, 5, 8, 8);
    //     const key = "rect";
    //     grid.addBlockedGeometry(key, testRectangle);
    //     const generatedGrid = grid.generateBinaryMatrix();
    //     expect(generatedGrid).toEqual([
    //         [1, 1, 0],
    //         [1, 1, 0],
    //         [0, 0, 0]
    //     ]);
    // });

});