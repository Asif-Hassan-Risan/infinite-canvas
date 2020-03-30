import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import {Position} from "../../../geometry/position";
import { combineInstructions, instructionSequence } from "../../../instruction-utils";
import { InstructionUsingInfinity } from "../../instruction-using-infinity";

export class PathInstructionBuilderAtInfinity extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(private readonly initialPosition: PointAtInfinity, private readonly instructionToGoAroundViewbox: InstructionUsingInfinity, private readonly containsFinitePoint: boolean, private readonly positionsSoFar: PointAtInfinity[], private readonly currentPosition: PointAtInfinity){
        super();
    }
    public getLineTo(position: Position): InstructionUsingInfinity{
        if(isPointAtInfinity(position)){
            return undefined;
        }
        if(this.positionsSoFar.length === 1){
            return this.lineTo(position);
        }
        const pointsAtInfinityToLineTo: PointAtInfinity[] = this.positionsSoFar.slice(1);
        let positionToLineFrom: PointAtInfinity = this.initialPosition;
        const instructionsToCombine: InstructionUsingInfinity[] = [];
        for(let pointAtInfinityToLineTo of pointsAtInfinityToLineTo){
            instructionsToCombine.push(this.lineToInfinityFromInfinityFromPoint(position, positionToLineFrom.direction, pointAtInfinityToLineTo.direction));
            positionToLineFrom = pointAtInfinityToLineTo;
        }
        return instructionSequence(combineInstructions(instructionsToCombine), this.lineTo(position))
    }
    public getMoveTo(): InstructionUsingInfinity{
        if(this.containsFinitePoint){
            return this.instructionToGoAroundViewbox;
        }
        return () => {};
    }
}