import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { Instruction } from "../../instruction";
import { instructionSequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointAtInfinityToPoint extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(infinity: ViewboxInfinity, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, private readonly currentPosition: Point){
        super(infinity);
    }
    public getLineTo(position: Position): Instruction{
        if(isPointAtInfinity(position)){
            return this.lineToInfinityFromPointInDirection(this.currentPosition, position.direction);
        }
        return this.lineTo(position);
    }
    public getMoveTo(): Instruction{
        const moveToInfinityFromCurrentPosition: Instruction = this.moveToInfinityFromPointInDirection(this.currentPosition, this.initialPosition.direction);
        if(this.currentPosition.equals(this.firstFinitePoint)){
            return moveToInfinityFromCurrentPosition;
        }
        const lineToInfinityFromFirstFinitePoint: Instruction = this.lineToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction);
        return instructionSequence(moveToInfinityFromCurrentPosition, lineToInfinityFromFirstFinitePoint);
    }
}