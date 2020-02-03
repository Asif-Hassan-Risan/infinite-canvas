import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";

export interface Area{
    intersectWith(area: Area): Area;
    intersectWithRectangle(rectangle: Rectangle): Area
    containsPoint(point: Point): boolean;
    isContainedByRectangle(rectangle: Rectangle): boolean;
    intersectsRectangle(rectangle: Rectangle): boolean;
}
