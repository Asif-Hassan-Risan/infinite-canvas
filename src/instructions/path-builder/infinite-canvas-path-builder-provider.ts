import { PathBuilderProvider } from "./path-builder-provider";
import { isPointAtInfinity } from "../../geometry/is-point-at-infinity";
import { Position } from "../../geometry/position";
import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { Point } from "../../geometry/point";
import { PathBuilder } from "./path-builder";
import { FromPointAtInfinityToPointAtInfinity } from "./from-point-at-infinity-to-point-at-infinity";
import { FromPointAtInfinityToPoint } from "./from-point-at-infinity-to-point";
import { FromPointToPointAtInfinity } from "./from-point-to-point-at-infinity";
import { FromPointToPoint } from "./from-point-to-point";
import { AtInfinity } from "./at-infinity";

export const infiniteCanvasPathBuilderProvider: PathBuilderProvider = {
    fromPointAtInfinityToPointAtInfinity(initialPosition: PointAtInfinity, firstFinitePoint: Point, lastFinitePoint: Point, currentPosition: PointAtInfinity): PathBuilder{
        return new FromPointAtInfinityToPointAtInfinity(infiniteCanvasPathBuilderProvider, initialPosition, firstFinitePoint, lastFinitePoint, currentPosition);
    },
    fromPointAtInfinityToPoint(initialPosition: PointAtInfinity, firstFinitePoint: Point, currentPosition: Point): PathBuilder{
        return new FromPointAtInfinityToPoint(infiniteCanvasPathBuilderProvider, initialPosition, firstFinitePoint, currentPosition);
    },
    fromPointToPointAtInfinity(initialPoint: Point, currentPosition: PointAtInfinity): PathBuilder{
        return new FromPointToPointAtInfinity(infiniteCanvasPathBuilderProvider, initialPoint, currentPosition);
    },
    fromPointToPoint(initialPoint: Point, currentPoint: Point): PathBuilder{
        return new FromPointToPoint(infiniteCanvasPathBuilderProvider, initialPoint, currentPoint);
    },
    atInfinity(initialPosition: PointAtInfinity, currentPosition: PointAtInfinity): PathBuilder{
        return new AtInfinity(infiniteCanvasPathBuilderProvider, initialPosition, currentPosition);
    },
    getBuilderFromPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
           return new AtInfinity(infiniteCanvasPathBuilderProvider, position, position);
        }
        return new FromPointToPoint(infiniteCanvasPathBuilderProvider, position, position);
    }
};