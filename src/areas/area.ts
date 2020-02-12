import { Point } from "../geometry/point";
import { ConvexPolygon } from "./convex-polygon";
import { Transformation } from "../transformation";

export interface Area{
    intersectWith(area: Area): Area;
    intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area;
    containsPoint(point: Point): boolean;
    isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    contains(other: Area): boolean;
    intersectsConvexPolygon(other: ConvexPolygon): boolean;
    intersects(other: Area): boolean;
    expandToIncludePoint(point: Point): Area;
    expandToIncludePolygon(polygon: ConvexPolygon): Area;
    expandToInclude(other: Area): Area;
    transform(transformation: Transformation): Area;
}
