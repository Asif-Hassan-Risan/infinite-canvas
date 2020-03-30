import {PointAtInfinity} from "../../../geometry/point-at-infinity";
import {Point} from "../../../geometry/point";
import {PathBuilder} from "../path-builder";
import {Position} from "../../../geometry/position";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import {Transformation} from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilderFromPointAtInfinityToPoint } from "./path-instruction-builder-from-point-at-infinity-to-point";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { InfiniteCanvasPathBuilder } from "../infinite-canvas-path-builder";

export class PathBuilderFromPointAtInfinityToPoint extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, public currentPosition: Point) {
        super();
    }
    protected getInstructionBuilder(): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointAtInfinityToPoint(this.initialPosition, this.firstFinitePoint, this.currentPosition);
    }
    public canAddLineTo(position: Position): boolean{
        return true;
    }
    public containsFinitePoint(): boolean{
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
    protected transform(transformation: Transformation): InfiniteCanvasPathBuilder{
        return new PathBuilderFromPointAtInfinityToPoint(this.pathBuilderProvider, transformation.applyToPointAtInfinity(this.initialPosition), transformation.apply(this.firstFinitePoint), transformation.apply(this.currentPosition));
    }
}
