import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { instructionSequence } from "../../../instruction-utils";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";

export class PathInstructionBuilderFromPointAtInfinityToPoint extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, private readonly currentPosition: Point){
        super();
    }
    public getLineTo(position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            return this.lineToInfinityFromPointInDirection(this.currentPosition, position.direction);
        }
        return this.lineTo(position);
    }
    public getMoveTo(): InstructionUsingInfinity{
        const moveToInfinityFromCurrentPosition: InstructionUsingInfinity = this.moveToInfinityFromPointInDirection(this.currentPosition, this.initialPosition.direction);
        if(this.currentPosition.equals(this.firstFinitePoint)){
            return moveToInfinityFromCurrentPosition;
        }
        const lineToInfinityFromFirstFinitePoint: InstructionUsingInfinity = this.lineToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction);
        return instructionSequence(moveToInfinityFromCurrentPosition, lineToInfinityFromFirstFinitePoint);
    }
}