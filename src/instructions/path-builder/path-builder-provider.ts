import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { Point } from "../../geometry/point";
import { PathBuilder } from "./path-builder";

export interface PathBuilderProvider{
    fromPointAtInfinityToPointAtInfinity(initialPosition: PointAtInfinity, firstFinitePoint: Point, lastFinitePoint: Point, currentPosition: PointAtInfinity): PathBuilder;
    fromPointAtInfinityToPoint(initialPosition: PointAtInfinity, firstFinitePoint: Point, currentPosition: Point): PathBuilder;
    fromPointToPointAtInfinity(initialPoint: Point, currentPosition: PointAtInfinity): PathBuilder;
    fromPointToPoint(initialPoint: Point, currentPoint: Point): PathBuilder;
    atInfinity(initialPosition: PointAtInfinity, containsFinitePoint: boolean, positionsSoFar: PointAtInfinity[], currentPosition: PointAtInfinity): PathBuilder;
}