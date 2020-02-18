import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Point } from "../geometry/point";
import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { HalfPlane } from "./half-plane";
import { lineAtInfinity } from "./line-at-infinity";

export class HalfLineAtInfinity implements SubsetOfLineAtInfinity{
    constructor(private towardsMiddle: Point){}
    public addPoint(point: Point): Area{
        return new ConvexPolygon([new HalfPlane(point, this.towardsMiddle)]);
    }
    public addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity{
        if(direction.dot(this.towardsMiddle) >= 0){
            return this;
        }
        return lineAtInfinity;
    }
}