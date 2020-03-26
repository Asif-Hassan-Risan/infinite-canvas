import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Instruction } from "../../instruction";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import {Position} from "../../../geometry/position";

export class PathInstructionBuilderAtInfinity extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(infinity: ViewboxInfinity, private readonly initialPosition: PointAtInfinity, private readonly currentPosition: PointAtInfinity){
        super(infinity);
    }
    public getLineTo(position: Position): Instruction{
        if(isPointAtInfinity(position)){
            return undefined;
        }
        return this.lineTo(position);
    }
    public getMoveTo(): Instruction{
        return undefined;
    }
}