import { Rectangle } from "../rectangle";
import { Transformation } from "../transformation";
import { Point } from "../point";

export interface Area{
    intersectWithRectangle(rectangle: Rectangle): Area;
    intersectsRectangle(rectangle: Rectangle): boolean;
    isContainedByRectangle(rectangle: Rectangle): boolean;
    intersectWith(other: Area): Area;
    intersects(other: Area): boolean;
    contains(other: Area): boolean;
    transform(transformation: Transformation): Area;
    expandToIncludeRectangle(rectangle: Rectangle): Area;
    expandToInclude(pointOrRectangle: Point | Area): Area;
}