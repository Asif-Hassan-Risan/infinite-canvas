import {Point} from "../../geometry/point";
import {PathBuilder} from "./path-builder";
import {Position} from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Instruction} from "../instruction";
import {isPointAtInfinity} from "../../geometry/is-point-at-infinity";
import {InfiniteCanvasPathBuilder} from "./infinite-canvas-path-builder";
import { instructionSequence } from "../../instruction-utils";
import { Transformation } from "../../transformation";
import { PathBuilderProvider } from "./path-builder-provider";

export class FromPointToPoint extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPoint: Point, public readonly currentPosition: Point) {
        super();
    }
    public getLineTo(position: Position, infinity: ViewboxInfinity): Instruction{
        if(isPointAtInfinity(position)){
            const lineToInfinityFromCurrent: Instruction = this.lineToInfinityFromPointInDirection(this.currentPosition, position.direction, infinity);
            if(this.currentPosition.minus(this.initialPoint).cross(position.direction) === 0){
                return lineToInfinityFromCurrent;
            }
            const lineToInfinityFromInitial: Instruction = this.lineToInfinityFromPointInDirection(this.initialPoint, position.direction, infinity);
            return instructionSequence(lineToInfinityFromCurrent, lineToInfinityFromInitial);
        }
        return this.lineTo(position);
    }
    public isClosable(): boolean{
        return true;
    }
    public getMoveTo(): Instruction{
        return this.moveTo(this.initialPoint);
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointToPointAtInfinity(this.initialPoint, position);
        }
        return this.pathBuilderProvider.fromPointToPoint(this.initialPoint, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new FromPointToPoint(this.pathBuilderProvider, transformation.apply(this.initialPoint), transformation.apply(this.currentPosition));
    }
}
