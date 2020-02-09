import { Area } from "./area";
import { Rectangle } from "./rectangle";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";

class Plane implements Area{
    public intersectWith(area: Area): Area {
        return area;
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        return rectangle;
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        return convexPolygon;
    }
    public containsPoint(point: Point): boolean {
        return true;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return false;
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        return true;
    }
}
export const plane: Plane = new Plane();