import { Ray } from "./ray";
import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";

export class LineSegment implements Area{
    constructor(public point1: Point, public point2: Point){}
    public intersectWith(area: Area): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        throw new Error("Method not implemented.");
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean {
        return other.containsPoint(this.point1) && other.containsPoint(this.point2);
    }
    public contains(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean {
        if(!other.intersectsLine(this.point1, this.point2.minus(this.point1))){
            return false;
        }

        throw new Error("Method not implemented.");
    }
    public intersects(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public expandToIncludePoint(point: Point): Area {
        throw new Error("Method not implemented.");
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        return this.expandToInclude(polygon);
    }
    public expandToInclude(other: Area): Area {
        return other.expandToIncludePoint(this.point1).expandToIncludePoint(this.point2);
    }
    public transform(transformation: Transformation): Area {
        return new LineSegment(transformation.apply(this.point1), transformation.apply(this.point2));
    }
}