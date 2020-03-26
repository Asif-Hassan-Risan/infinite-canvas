import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { instructionSequence } from "../../../instruction-utils";
import { Instruction } from "../../instruction";

export class PathInstructionBuilderFromPointAtInfinityToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(infinity: ViewboxInfinity, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, private readonly lastFinitePoint: Point, private readonly currentPosition: PointAtInfinity){
        super(infinity);
    }
    public getLineTo(position: Position): Instruction{
        if(isPointAtInfinity(position)){
            return this.lineToInfinityFromInfinityFromPoint(this.lastFinitePoint, this.currentPosition.direction, position.direction);
        }
        return instructionSequence(this.lineToInfinityFromPointInDirection(position, this.currentPosition.direction), this.lineTo(position));
    }
    public getMoveTo(): Instruction{
        if(this.initialPosition.direction.cross(this.currentPosition.direction) === 0){
            return this.moveToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction);
        }
        return instructionSequence(
            this.moveToInfinityFromPointInDirection(this.lastFinitePoint, this.currentPosition.direction),
            this.lineToInfinityFromInfinityFromPoint(this.lastFinitePoint, this.currentPosition.direction, this.initialPosition.direction),
            this.lineToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction));
    }
}