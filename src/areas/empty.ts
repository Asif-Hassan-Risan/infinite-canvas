import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";

class Empty implements Area{
    public intersectWith(area: Area): Area {
        return this;
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        return this;
    }
    public containsPoint(point: Point): boolean {
        return false;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return true;
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        return false;
    }
    public expandToIncludePoint(point: Point): Area {
        return this;
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        return polygon;
    }
}
export const empty: Empty = new Empty();