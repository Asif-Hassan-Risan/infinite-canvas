import { Transformation } from "../transformation";
import { Rectangle } from "./rectangle";
import { Point } from "../point";
import { PathInstruction } from "../interfaces/path-instruction";

export interface Area{
    expandToInclude(area: Area): Area;
    expandToIncludeRectangle(rectangle: Rectangle): Area;
    expandToIncludePoint(point: Point): Area;
    transform(transformation: Transformation): Area;
    intersectWith(area: Area): Area;
    intersectWithRectangle(rectangle: Rectangle): Area
    contains(area: Area): boolean;
    isContainedByRectangle(rectangle: Rectangle): boolean
    intersects(area: Area): boolean;
    intersectsRectangle(rectangle: Rectangle): boolean;
    getInstructionToClear(): PathInstruction;
}