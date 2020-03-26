import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { Point } from "../../../geometry/point";
import { Instruction } from "../../instruction";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { instructionSequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointToPoint extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(infinity: ViewboxInfinity, private readonly initialPoint: Point, private readonly currentPosition: Point){
        super(infinity);
    }
    public getMoveTo(): Instruction{
        return this.moveTo(this.initialPoint);
    }
    public getLineTo(position: Position): Instruction{
        if(isPointAtInfinity(position)){
            const lineToInfinityFromCurrent: Instruction = this.lineToInfinityFromPointInDirection(this.currentPosition, position.direction);
            if(this.currentPosition.minus(this.initialPoint).cross(position.direction) === 0){
                return lineToInfinityFromCurrent;
            }
            const lineToInfinityFromInitial: Instruction = this.lineToInfinityFromPointInDirection(this.initialPoint, position.direction);
            return instructionSequence(lineToInfinityFromCurrent, lineToInfinityFromInitial);
        }
        return this.lineTo(position);
    }
}