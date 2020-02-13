import { Ray } from "./ray";
import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";

export class LineSegment implements Area{
    private constructor(private rays: Ray[]){}
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
    public transform(transformation: Transformation): Area {
        throw new Error("Method not implemented.");
    }
    public static createWithStartAndEnd(start: Point, end: Point): LineSegment{
        return new LineSegment([new Ray(start, end.minus(start)), new Ray(end, start.minus(end))]);
    }
    public static createWithStart(start: Point, direction: Point): LineSegment{
        return new LineSegment([new Ray(start, direction)]);
    }
}