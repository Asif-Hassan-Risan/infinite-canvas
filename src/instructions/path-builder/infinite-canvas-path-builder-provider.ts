import { PathBuilderProvider } from "./path-builder-provider";
import { isPointAtInfinity } from "../../geometry/is-point-at-infinity";
import { Position } from "../../geometry/position";
import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { Point } from "../../geometry/point";
import { PathBuilder } from "./path-builder";
import { PathBuilderFromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity/path-builder-from-point-at-infinity-to-point-at-infinity";
import { PathBuilderFromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point/path-builder-from-point-at-infinity-to-point";
import { PathBuilderFromPointToPointAtInfinity } from "./from-point-to-point-at-infinity/path-builder-from-point-to-point-at-infinity";
import { PathBuilderFromPointToPoint } from "./from-point-to-point/path-builder-from-point-to-point";
import { PathBuilderAtInfinity } from "./at-infinity/path-builder-at-infinity";
import { ViewboxInfinityProvider } from "../../interfaces/viewbox-infinity-provider";

export class InfiniteCanvasPathBuilderProvider implements PathBuilderProvider {
    constructor(private readonly infinityProvider: ViewboxInfinityProvider){}
    fromPointAtInfinityToPointAtInfinity(initialPosition: PointAtInfinity, firstFinitePoint: Point, lastFinitePoint: Point, currentPosition: PointAtInfinity): PathBuilder{
        return new PathBuilderFromPointAtInfinityToPointAtInfinity(this, this.infinityProvider, initialPosition, firstFinitePoint, lastFinitePoint, currentPosition);
    }
    fromPointAtInfinityToPoint(initialPosition: PointAtInfinity, firstFinitePoint: Point, currentPosition: Point): PathBuilder{
        return new PathBuilderFromPointAtInfinityToPoint(this, this.infinityProvider, initialPosition, firstFinitePoint, currentPosition);
    }
    fromPointToPointAtInfinity(initialPoint: Point, currentPosition: PointAtInfinity): PathBuilder{
        return new PathBuilderFromPointToPointAtInfinity(this, this.infinityProvider, initialPoint, currentPosition);
    }
    fromPointToPoint(initialPoint: Point, currentPoint: Point): PathBuilder{
        return new PathBuilderFromPointToPoint(this, this.infinityProvider, initialPoint, currentPoint);
    }
    atInfinity(initialPosition: PointAtInfinity, containsFinitePoint: boolean, positionsSoFar: PointAtInfinity[], currentPosition: PointAtInfinity): PathBuilder{
        return new PathBuilderAtInfinity(this, this.infinityProvider, initialPosition, containsFinitePoint, positionsSoFar, currentPosition);
    }
    getBuilderFromPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
           return new PathBuilderAtInfinity(this, this.infinityProvider, position, false, [position], position);
        }
        return new PathBuilderFromPointToPoint(this, this.infinityProvider, position, position);
    }
};