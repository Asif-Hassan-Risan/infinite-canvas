import { Transformation } from "../transformation";
import { Rectangle } from "./rectangle";
import { Point } from "../point";
import { PathInstruction } from "../interfaces/path-instruction";
import { HalfPlane } from "./half-plane";

export interface Area{
    expandToInclude(area: Area): Area;
    expandToIncludeHalfPlane(halfPlane: HalfPlane): Area;
    expandToIncludePoint(point: Point): Area;
    transform(transformation: Transformation): Area;
    intersectWith(area: Area): Area;
    intersectWithRectangle(rectangle: Rectangle): Area
    contains(area: Area): boolean;
    containsPoint(point: Point): boolean;
    isContainedByRectangle(rectangle: Rectangle): boolean;
    isContainedByHalfPlane(halfPlane: HalfPlane): boolean;
    intersects(area: Area): boolean;
    intersectsRectangle(rectangle: Rectangle): boolean;
    getInstructionToClear(): PathInstruction;
}