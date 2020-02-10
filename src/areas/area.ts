import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";
import { ConvexPolygon } from "./convex-polygon";

export interface Area{
    intersectWith(area: Area): Area;
    intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area;
    containsPoint(point: Point): boolean;
    isContainedByRectangle(rectangle: Rectangle): boolean;
    intersectsRectangle(rectangle: Rectangle): boolean;
    expandToIncludePoint(point: Point): Area;
    expandToIncludePolygon(polygon: ConvexPolygon): Area;
}
