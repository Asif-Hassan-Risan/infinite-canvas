import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { Point } from "../../../geometry/point";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { instructionSequence } from "../../../instruction-utils";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";

export class PathInstructionBuilderFromPointToPoint extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(private readonly initialPoint: Point, private readonly currentPosition: Point){
        super();
    }
    public getMoveTo(): InstructionUsingInfinity{
        return this.moveTo(this.initialPoint);
    }
    public getLineTo(position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            const lineToInfinityFromCurrent: InstructionUsingInfinity = this.lineToInfinityFromPointInDirection(this.currentPosition, position.direction);
            if(this.currentPosition.minus(this.initialPoint).cross(position.direction) === 0){
                return lineToInfinityFromCurrent;
            }
            const lineToInfinityFromInitial: InstructionUsingInfinity = this.lineToInfinityFromPointInDirection(this.initialPoint, position.direction);
            return instructionSequence(lineToInfinityFromCurrent, lineToInfinityFromInitial);
        }
        return this.lineTo(position);
    }
}