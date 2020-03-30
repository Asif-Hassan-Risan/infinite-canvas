import {PointAtInfinity} from "../../../geometry/point-at-infinity";
import {Point} from "../../../geometry/point";
import {PathBuilder} from "../path-builder";
import {Position} from "../../../geometry/position";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import {Transformation} from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderFromPointAtInfinityToPointAtInfinity } from "./path-instruction-builder-from-point-at-infinity-to-point-at-infinity";
import { InfiniteCanvasPathBuilder } from "../infinite-canvas-path-builder";

export class PathBuilderFromPointAtInfinityToPointAtInfinity extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, private readonly lastFinitePoint: Point, public currentPosition: PointAtInfinity) {
        super();
    }
    protected getInstructionBuilder(): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointAtInfinityToPointAtInfinity(this.initialPosition, this.firstFinitePoint, this.lastFinitePoint, this.currentPosition);
    }
    public containsFinitePoint(): boolean{
        return true;
    }
    public isClosable(): boolean{
        return !this.initialPosition.direction.isInOppositeDirectionAs(this.currentPosition.direction);
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.currentPosition.direction);
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(this.initialPosition, this.firstFinitePoint, this.lastFinitePoint, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, this.firstFinitePoint, position);
    }
    protected transform(transformation: Transformation): InfiniteCanvasPathBuilder{
        return new PathBuilderFromPointAtInfinityToPointAtInfinity(
            this.pathBuilderProvider,
            transformation.applyToPointAtInfinity(this.initialPosition),
            transformation.apply(this.firstFinitePoint),
            transformation.apply(this.lastFinitePoint),
            transformation.applyToPointAtInfinity(this.currentPosition));
    }
}