import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { empty } from "./empty";
import { HalfPlaneLineIntersection } from "./half-plane-line-intersection";

export class LineSegment implements Area{
    private direction: Point;
    constructor(public point1: Point, public point2: Point){
        this.direction = point2.minus(point1);
    }
    public intersectWith(area: Area): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        if(!this.intersectsConvexPolygon(convexPolygon)){
            return empty;
        }
        if(this.isContainedByConvexPolygon(convexPolygon)){
            return this;
        }
        const intersections: HalfPlaneLineIntersection[] = convexPolygon.intersectWithLine(this.point1, this.direction);
        let point1: Point = this.point1;
        let point2: Point = this.point2;
        for(let intersection of intersections){
            if(this.pointIsBetweenPoints(intersection.point, point1, point2)){
                if(intersection.halfPlane.normalTowardInterior.dot(this.direction) > 0){
                    point1 = intersection.point;
                }else{
                    point2 = intersection.point;
                }
            }
        }
        if(point1.equals(point2)){
            return empty;
        }
        return new LineSegment(point1, point2);
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean {
        return other.containsPoint(this.point1) && other.containsPoint(this.point2);
    }
    public contains(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    private pointIsBetweenPoints(point: Point, one: Point, other: Point): boolean{
        return point.minus(one).dot(this.direction) * point.minus(other).dot(this.direction) <= 0;
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean {
        if(this.isContainedByConvexPolygon(other)){
            return true;
        }
        const intersections: HalfPlaneLineIntersection[] = other.intersectWithLine(this.point1, this.point2.minus(this.point1));
        for(let intersection of intersections){
            if(this.pointIsBetweenPoints(intersection.point, this.point1, this.point2)){
                return true;
            }
        }
        return false;
        //return other.containsPoint(this.point1) || other.containsPoint(this.point2);
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