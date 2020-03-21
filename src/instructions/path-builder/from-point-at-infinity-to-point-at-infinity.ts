import {PointAtInfinity} from "../../geometry/point-at-infinity";
import {Point} from "../../geometry/point";
import {InfiniteCanvasPathBuilder} from "./infinite-canvas-path-builder";
import {PathBuilder} from "./path-builder";
import {Position} from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Instruction} from "../instruction";
import {isPointAtInfinity} from "../../geometry/is-point-at-infinity";
import {Transformation} from "../../transformation";
import { PathBuilderProvider } from "./path-builder-provider";
import { instructionSequence } from "../../instruction-utils";

export class FromPointAtInfinityToPointAtInfinity extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, private readonly lastFinitePoint: Point, public currentPosition: PointAtInfinity) {
        super();
    }
    public getLineTo(position: Position, infinity: ViewboxInfinity): Instruction{
        if(isPointAtInfinity(position)){
            return undefined;
        }
        return instructionSequence(this.lineToInfinityFromPointInDirection(position, this.currentPosition.direction, infinity), this.lineTo(position));
    }
    public getMoveTo(infinity: ViewboxInfinity): Instruction{
        if(this.initialPosition.direction.inSameDirectionAs(this.currentPosition.direction)){
            return this.moveToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction, infinity);
        }
        if(this.initialPosition.direction.cross(this.currentPosition.direction) === 0){
            if(this.firstFinitePoint.equals(this.lastFinitePoint)){
                return this.moveToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction, infinity);
            }
            
        }
        return instructionSequence(
            this.moveToInfinityFromPointInDirection(this.lastFinitePoint, this.currentPosition.direction, infinity),
            this.lineToInfinityFromInfinityFromPoint(this.lastFinitePoint, this.currentPosition.direction, this.initialPosition.direction, infinity),
            this.lineToInfinityFromPointInDirection(this.firstFinitePoint, this.initialPosition.direction, infinity));
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(this.initialPosition, this.firstFinitePoint, this.lastFinitePoint, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, this.firstFinitePoint, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new FromPointAtInfinityToPointAtInfinity(
            this.pathBuilderProvider,
            transformation.applyToPointAtInfinity(this.initialPosition),
            transformation.apply(this.firstFinitePoint),
            transformation.apply(this.lastFinitePoint),
            transformation.applyToPointAtInfinity(this.currentPosition));
    }
}