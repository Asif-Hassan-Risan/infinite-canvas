import { Ray } from "./ray";
import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";

export class LineSegment implements Area{
    constructor(private ray1: Ray, private ray2?: Ray){}
    public intersectWith(area: Area): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        throw new Error("Method not implemented.");
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean {
        throw new Error("Method not implemented.");
    }
    public contains(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean {
        throw new Error("Method not implemented.");
    }
    public intersects(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public expandToIncludePoint(point: Point): Area {
        throw new Error("Method not implemented.");
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        throw new Error("Method not implemented.");
    }
    public expandToInclude(other: Area): Area {
        throw new Error("Method not implemented.");
    }
    public transform(transformation: import("../transformation").Transformation): Area {
        throw new Error("Method not implemented.");
    }
}