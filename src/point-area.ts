import { Area } from "./interfaces/area";
import { Point } from "./point";
import { Rectangle } from "./rectangle";
import { Transformation } from "./transformation";

export class PointArea implements Area{
    constructor(private readonly point: Point){}
    intersectWithRectangle(rectangle: Rectangle): Area {
        return rectangle.expandToInclude(this.point);
    }
    intersectsRectangle(rectangle: Rectangle): boolean {
        return rectangle.contains()
    }
    isContainedByRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    intersectWith(other: Area): Area {
        throw new Error("Method not implemented.");
    }
    intersects(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    contains(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    transform(transformation: Transformation): Area {
        throw new Error("Method not implemented.");
    }
    expandToIncludeRectangle(rectangle: Rectangle): Area {
        throw new Error("Method not implemented.");
    }
    expandToInclude(pointOrRectangle: Area | Point): Area {
        throw new Error("Method not implemented.");
    }
    

}