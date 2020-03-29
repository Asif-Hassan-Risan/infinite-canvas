import { InfiniteCanvasPathInstructionBuilder } from "../infinite-canvas-path-instruction-builder";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Instruction } from "../../instruction";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import {Position} from "../../../geometry/position";
import { combineInstructions, instructionSequence } from "../../../instruction-utils";
import { PathInfinityProvider } from "../../../interfaces/path-infinity-provider";

export class PathInstructionBuilderAtInfinity extends InfiniteCanvasPathInstructionBuilder implements PathInstructionBuilder{
    constructor(infinity: ViewboxInfinity, private readonly initialPosition: PointAtInfinity, private readonly infinityProvider: PathInfinityProvider, private readonly containsFinitePoint: boolean, private readonly positionsSoFar: PointAtInfinity[], private readonly currentPosition: PointAtInfinity){
        super(infinity);
    }
    public getLineTo(position: Position): Instruction{
        if(isPointAtInfinity(position)){
            return undefined;
        }
        if(this.positionsSoFar.length === 1){
            return this.lineTo(position);
        }
        const pointsAtInfinityToLineTo: PointAtInfinity[] = this.positionsSoFar.slice(1);
        let positionToLineFrom: PointAtInfinity = this.initialPosition;
        const instructionsToCombine: Instruction[] = [];
        for(let pointAtInfinityToLineTo of pointsAtInfinityToLineTo){
            instructionsToCombine.push(this.lineToInfinityFromInfinityFromPoint(position, positionToLineFrom.direction, pointAtInfinityToLineTo.direction));
            positionToLineFrom = pointAtInfinityToLineTo;
        }
        return instructionSequence(combineInstructions(instructionsToCombine), this.lineTo(position))
    }
    public getMoveTo(): Instruction{
        if(this.containsFinitePoint){
            return this.infinityProvider.getPathInstructionToGoAroundViewbox();
        }
        return () => {};
    }
}