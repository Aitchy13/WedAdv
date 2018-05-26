import * as _ from "lodash";

import { Vector } from "../core/vector";
import { MathsUtility } from "../utilities/maths";
import { Rectangle } from "../game-objects/rectangle";
import { CollisionDetector } from "../detectors/collision-detector";

export interface INavGridConfig {
    width: number;
    height: number;
    x?: number;
    y?: number;
    cellSize?: number;
}

interface ICell {
    blockedBy: string;
    x: number;
    y: number;
    matrixCoords: number[];
}

export class NavGrid {

    public width: number;
    public height: number;
    public x: number = 0;
    public y: number = 0;
    public cellSize: number = 20;

    private blockedRectangles: {
        [key: string]: Rectangle
    } = {};

    private generatedMatrix: ICell[][];

    constructor(config: INavGridConfig) {
        if (!_.isNumber(config.width) || config.width <= 0) {
            throw new Error("Invalid width specified");
        }
        this.width = config.width;
        if (!_.isNumber(config.height) || config.height <= 0) {
            throw new Error("Invalid height specified");
        }
        this.height = config.height;
        if (_.isNumber(config.x)) {
            this.x = config.x;
        }
        if (_.isNumber(config.y)) {
            this.y = config.y;
        }
        if (_.isNumber(config.cellSize)) {
            this.cellSize = config.cellSize;
        }
    }

    public generate(): ICell[][] {
        const matrix: ICell[][] = [];

        const minRows = Math.ceil(this.height / this.cellSize);
        const minCells = Math.ceil(this.width / this.cellSize);

        for (let r = 0; r < minRows; r++) {
            let row: ICell[] = [];
            for (let c = 0; c < minCells; c++) {
                row.push(this.createCell(c, r));
            }
            matrix.push(row);
        }

        this.generatedMatrix = matrix;

        return matrix;
    }

    public generateBinaryMatrix(): number[][] {
        const matrix = this.generate();

        const binaryMatrix: number[][] = [];
        for (const row of matrix) {
            binaryMatrix.push(_.map(row, x => _.isString(x.blockedBy) ? 1 : 0));
        }
        return binaryMatrix;
    }

    public addBlockedGeometry(key: string, rect: Rectangle) {
        if (this.blockedRectangles[key]) {
            throw new Error("A geometry with that key has already been specified");
        }
        this.blockedRectangles[key] = rect;
    }

    public getCells(): ICell[] {
        if (!this.generatedMatrix) {
            this.generate();
        }

        return _.flatten(this.generatedMatrix);
    }

    public getUnblockedCells(): ICell[] {
        if (!this.generatedMatrix) {
            this.generate();
        }
        
        return _.chain(this.generatedMatrix)
            .flatten()
            .filter(x => !x.blockedBy)
            .value();
    }

    private createCell(cellIndex: number, rowIndex: number): ICell {
        const xCoordinate = cellIndex * this.cellSize;
        const yCoordinate = rowIndex * this.cellSize;

        const transposedCell = new Rectangle(this.cellSize, this.cellSize, xCoordinate, yCoordinate);

        let blockedBy: string;

        Object.keys(this.blockedRectangles).forEach(key => {
            if (blockedBy) {
                return;
            }
            const blockedRectangle = this.blockedRectangles[key];
            if (CollisionDetector.rectangleHasCollision(transposedCell, blockedRectangle)) {
                blockedBy = key;
            }
        });

        return {
            blockedBy: blockedBy,
            y: yCoordinate,
            x: xCoordinate,
            matrixCoords: [rowIndex, cellIndex]
        };
    }
 
}