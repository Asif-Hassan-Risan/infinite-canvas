import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { Point } from "../../geometry/point";
import { PathBuilder } from "./path-builder";
import { Position } from "../../geometry/position";

export interface PathBuilderProvider{
    fromPointAtInfinityToPointAtInfinity(initialPosition: PointAtInfinity, firstFinitePoint: Point, lastFinitePoint: Point, currentPosition: PointAtInfinity): PathBuilder;
    fromPointAtInfinityToPoint(initialPosition: PointAtInfinity, firstFinitePoint: Point, currentPosition: Point): PathBuilder;
    fromPointToPointAtInfinity(initialPoint: Point, currentPosition: PointAtInfinity): PathBuilder;
    fromPointToPoint(initialPoint: Point, currentPoint: Point): PathBuilder;
    atInfinity(initialPosition: PointAtInfinity, currentPosition: PointAtInfinity): PathBuilder;
    getBuilderFromPosition(position: Position): PathBuilder;
}