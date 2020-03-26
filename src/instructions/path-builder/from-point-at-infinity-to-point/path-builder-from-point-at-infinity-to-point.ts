import {PointAtInfinity} from "../../../geometry/point-at-infinity";
import {Point} from "../../../geometry/point";
import {PathBuilder} from "../path-builder";
import {Position} from "../../../geometry/position";
import {ViewboxInfinity} from "../../../interfaces/viewbox-infinity";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import {Transformation} from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilderFromPointAtInfinityToPoint } from "./path-instruction-builder-from-point-at-infinity-to-point";
import { PathInstructionBuilder } from "../path-instruction-builder";

export class PathBuilderFromPointAtInfinityToPoint implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, public currentPosition: Point) {
    }
    public getPathInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointAtInfinityToPoint(infinity, this.initialPosition, this.firstFinitePoint, this.currentPosition);
    }
    public canAddLineTo(position: Position): boolean{
        return true;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(this.initialPosition, this.firstFinitePoint, this.currentPosition, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, this.firstFinitePoint, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new PathBuilderFromPointAtInfinityToPoint(this.pathBuilderProvider, transformation.applyToPointAtInfinity(this.initialPosition), transformation.apply(this.firstFinitePoint), transformation.apply(this.currentPosition));
    }
}
