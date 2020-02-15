import { Point } from "../geometry/point";
import { ConvexPolygon } from "./convex-polygon";
import { Transformation } from "../transformation";
import { LineSegment } from "./line-segment";

export interface Area{
    intersectWith(area: Area): Area;
    intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area;
    intersectWithLineSegment(lineSegment: LineSegment): Area;
    isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    isContainedByLineSegment(lineSegment: LineSegment): boolean;
    contains(other: Area): boolean;
    intersectsConvexPolygon(other: ConvexPolygon): boolean;
    intersectsLineSegment(lineSegment: LineSegment): boolean;
    intersects(other: Area): boolean;
    expandToIncludePoint(point: Point): Area;
    expandToIncludePolygon(polygon: ConvexPolygon): Area;
    expandToInclude(other: Area): Area;
    transform(transformation: Transformation): Area;
}
