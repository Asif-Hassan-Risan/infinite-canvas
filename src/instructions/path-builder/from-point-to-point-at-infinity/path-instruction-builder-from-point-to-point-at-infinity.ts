import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { Point } from "../../../geometry/point";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import {Position} from "../../../geometry/position";
import { Instruction } from "../../instruction";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { instructionSequence } from "../../../instruction-utils";

export class PathInstructionBuilderFromPointToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(infinity: ViewboxInfinity, private readonly initialPoint: Point, private readonly currentPosition: PointAtInfinity){
        super(infinity);
    }
    public getLineTo(position: Position): Instruction{
        if(isPointAtInfinity(position)){
            if(position.direction.inSameDirectionAs(this.currentPosition.direction)){
                return () => {};
            }
            if(position.direction.cross(this.currentPosition.direction) === 0){
                return this.lineToInfinityFromPointInDirection(this.initialPoint, position.direction);
            }
            return this.lineToInfinityFromInfinityFromPoint(this.initialPoint, this.currentPosition.direction, position.direction);
        }
        return instructionSequence(this.lineToInfinityFromPointInDirection(position, this.currentPosition.direction), this.lineTo(position));
    }
    public getMoveTo(): Instruction{
        return this.moveTo(this.initialPoint);
    }
}