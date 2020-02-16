import { Point } from "../geometry/point";
import { Area } from "./area";
import { Transformation } from "../transformation";
import { ConvexPolygon } from "./convex-polygon";
import { LineSegment } from "./line-segment";
import { SubsetOfLine } from "./subset-of-line";
import { empty } from "./empty";
import { HalfPlaneLineIntersection } from "./half-plane-line-intersection";

export class Ray extends SubsetOfLine implements Area{
    constructor(public base: Point, public direction: Point){
        super(base, direction);
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
        const intersections: HalfPlaneLineIntersection[] = convexPolygon.intersectWithLine(this.base, this.direction);
        let point1: Point = this.base;
        let point2: Point;
        for(let intersection of intersections){
            if(!point2 && this.comesBefore(point1, intersection.point) || point2 && this.pointIsBetweenPoints(intersection.point, point1, point2)){
                if(intersection.halfPlane.normalTowardInterior.dot(this.direction) > 0){
                    point1 = intersection.point;
                }else{
                    point2 = intersection.point;
                }
            }
        }
        if(point2){
            return new LineSegment(point1, point2);
        }
        return new Ray(point1, this.direction);
    }
    public intersectWithLineSegment(lineSegment: LineSegment): Area {
        if(lineSegment.isContainedByRay(this)){
            return lineSegment;
        }
        if(!this.lineSegmentIsOnSameLine(lineSegment)){
            return empty;
        }
        let {point2: otherPoint2} = this.getPointsInSameDirection(lineSegment.point1, lineSegment.point2);
        if(this.comesBefore(otherPoint2, this.base)){
            return empty;
        }
        return new LineSegment(this.base, otherPoint2);
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean {
        return other.containsPoint(this.base) && other.containsInfinityInDirection(this.direction);
    }
    public isContainedByLineSegment(lineSegment: LineSegment): boolean {
        return false;
    }
    public contains(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public intersectsLineSegment(lineSegment: LineSegment): boolean {
        if(lineSegment.isContainedByRay(this)){
            return true;
        }
        if(!this.lineSegmentIsOnSameLine(lineSegment)){
            return false;
        }
        let {point2: otherPoint2} = this.getPointsInSameDirection(lineSegment.point1, lineSegment.point2);
        if(this.comesBefore(otherPoint2, this.base)){
            return false;
        }
        return true;
    }
    public intersects(other: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public expandToIncludePoint(point: Point): Area {
        if(this.containsPoint(point)){
            return this;
        }
        if(this.pointIsOnSameLine(point)){
            return new Ray(point, this.direction);
        }
        return ConvexPolygon.createTriangleWithInfinityInDirection(this.base, point, this.direction);
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        throw new Error("Method not implemented.");
    }
    public expandToInclude(other: Area): Area {
        throw new Error("Method not implemented.");
    }
    public transform(transformation: Transformation): Area {
        const baseTransformed: Point = transformation.apply(this.base);
        return new Ray(baseTransformed, transformation.apply(this.base.plus(this.direction)).minus(baseTransformed));
    }
    protected interiorContainsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && !this.comesBefore(point, this.base);
    } 
    public containsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && this.comesBefore(this.base, point);
    }
}