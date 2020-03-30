import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { Point } from "../../../geometry/point";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { instructionSequence } from "../../../instruction-utils";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";

export class PathInstructionBuilderFromPointToPointAtInfinity extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(private readonly initialPoint: Point, private readonly currentPosition: PointAtInfinity){
        super();
    }
    public getLineTo(position: Position): InstructionUsingInfinity{
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
    public getMoveTo(): InstructionUsingInfinity{
        return this.moveTo(this.initialPoint);
    }
}