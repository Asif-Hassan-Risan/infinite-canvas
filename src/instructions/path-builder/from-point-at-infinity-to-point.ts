import {PointAtInfinity} from "../../geometry/point-at-infinity";
import {Point} from "../../geometry/point";
import {InfiniteCanvasPathBuilder} from "./infinite-canvas-path-builder";
import {PathBuilder} from "./path-builder";
import {Position} from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Instruction} from "../instruction";
import {isPointAtInfinity} from "../../geometry/is-point-at-infinity";
import {instructionSequence} from "../../instruction-utils";
import {Transformation} from "../../transformation";
import { PathBuilderProvider } from "./path-builder-provider";

export class FromPointAtInfinityToPoint extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, public currentPosition: Point) {
        super();
    }
    public getLineTo(position: Position, infinity: ViewboxInfinity): Instruction{
        if(isPointAtInfinity(position)){
            return this.lineToInfinityFromPointInDirection(this.currentPosition, position.direction, infinity);
        }
        return this.lineTo(position);
    }
    public isClosable(): boolean{
        return true;
    }
    public getMoveTo(infinity: ViewboxInfinity): Instruction{
        const moveToInfinityFromCurrentPosition: Instruction = this.moveToInfinityFromPointInDirection(this.currentPosition, this.initialPosition.direction, infinity);
        if(this.currentPosition.equals(this.firstFinitePoint)){
            return moveToInfinityFromCurrentPosition;
        }
        const lineToInfinityFromFirstFinitePoint: Instruction = this.lineToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction, infinity);
        return instructionSequence(moveToInfinityFromCurrentPosition, lineToInfinityFromFirstFinitePoint);
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(this.initialPosition, this.firstFinitePoint, this.currentPosition, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, this.firstFinitePoint, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new FromPointAtInfinityToPoint(this.pathBuilderProvider, transformation.applyToPointAtInfinity(this.initialPosition), transformation.apply(this.firstFinitePoint), transformation.apply(this.currentPosition));
    }
}
