import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";

class Plane implements Area{
    public expandToIncludePoint(point: Point): Area {
        return this;
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        return this;
    }
    public intersects(area: Area): boolean{
        return true;
    }
    public expandToInclude(area: Area): Area{
        return this;
    }
    public transform(transformation: Transformation): Area{
        return this;
    }
    public contains(other: Area): boolean{
        return true;
    }
    public intersectWith(area: Area): Area {
        return area;
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        return convexPolygon;
    }
    public containsPoint(point: Point): boolean {
        return true;
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean{
        return false;
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean{
        return true;
    }
}
export const plane: Plane = new Plane();