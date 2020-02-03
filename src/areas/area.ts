import { Transformation } from "../transformation";
import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";
import { HalfPlane } from "./half-plane";

export interface Area{
    transform(transformation: Transformation): Area;
    intersectWith(area: Area): Area;
    intersectWithRectangle(rectangle: Rectangle): Area
    contains(area: Area): boolean;
    containsPoint(point: Point): boolean;
    isContainedByRectangle(rectangle: Rectangle): boolean;
    isContainedByHalfPlane(halfPlane: HalfPlane): boolean;
    intersects(area: Area): boolean;
    intersectsRectangle(rectangle: Rectangle): boolean;
}
