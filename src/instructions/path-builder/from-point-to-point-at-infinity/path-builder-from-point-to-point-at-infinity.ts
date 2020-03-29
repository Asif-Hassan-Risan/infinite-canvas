import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import { PathBuilder } from "../path-builder";
import {Position} from "../../../geometry/position";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { Transformation } from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderFromPointToPointAtInfinity } from "./path-instruction-builder-from-point-to-point-at-infinity";
import { InfiniteCanvasPathBuilder } from "../infinite-canvas-path-builder";
import { PathInfinityProvider } from "../../../interfaces/path-infinity-provider";

export class PathBuilderFromPointToPointAtInfinity extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, infinityProvider: PathInfinityProvider, private readonly initialPoint: Point, public readonly currentPosition: PointAtInfinity) {
        super(infinityProvider);
    }
    protected getInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointToPointAtInfinity(infinity, this.initialPoint, this.currentPosition);
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.currentPosition.direction);
    }
    public containsFinitePoint(): boolean{
        return true;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointToPointAtInfinity(this.initialPoint, position);
        }
        return this.pathBuilderProvider.fromPointToPoint(this.initialPoint, position);
    }
    protected transform(transformation: Transformation): InfiniteCanvasPathBuilder{
        return new PathBuilderFromPointToPointAtInfinity(this.pathBuilderProvider, this.infinityProvider, transformation.apply(this.initialPoint), transformation.applyToPointAtInfinity(this.currentPosition));
    }
}
