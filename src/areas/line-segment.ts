import { Area } from "./area";
import { ConvexPolygon } from "./convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { empty } from "./empty";
import { HalfPlaneLineIntersection } from "./half-plane-line-intersection";

export class LineSegment implements Area{
    public direction: Point;
    constructor(public point1: Point, public point2: Point){
        this.direction = point2.minus(point1);
    }
    public intersectWith(area: Area): Area {
        return area.intersectWithLineSegment(this);
    }
    public intersectWithLineSegment(other: LineSegment): Area{
        if(this.isContainedByLineSegment(other)){
            return this;
        }
        if(other.isContainedByLineSegment(this)){
            return other;
        }
        if(!this.lineSegmentIsOnSameLine(other)){
            return empty;
        }
        let {point1: otherPoint1, point2: otherPoint2} = this.getPointsInSameDirection(other.point1, other.point2);
        if(this.comesBefore(otherPoint2, this.point1) || this.comesBefore(this.point2, otherPoint1)){
            return empty;
        }
        if(this.comesBefore(this.point1, otherPoint1)){
            return new LineSegment(otherPoint1, this.point2);
        }
        return new LineSegment(this.point1, otherPoint2);
    }
    private getPointsInSameDirection(point1: Point, point2: Point): {point1: Point, point2: Point}{
        if(this.comesBefore(point2, point1)){
            return {point1: point2, point2: point1};
        }
        return {point1, point2};
    }
    private comesBefore(point1: Point, point2: Point): boolean{
        return point2.minus(point1).dot(this.direction) >= 0;
    }
    public isContainedByLineSegment(other: LineSegment): boolean{
        return other.containsPoint(this.point1) && other.containsPoint(this.point2);
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
        return other.isContainedByLineSegment(this);
    }
    private pointIsBetweenPoints(point: Point, one: Point, other: Point): boolean{
        return point.minus(one).dot(this.direction) * point.minus(other).dot(this.direction) <= 0;
    }
    private pointIsOnSameLine(point: Point): boolean{
        return point.minus(this.point1).cross(this.direction) === 0;
    }
    private lineSegmentIsOnSameLine(other: LineSegment): boolean{
        return this.direction.cross(other.direction) === 0 && this.pointIsOnSameLine(other.point1)
    }
    public containsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && this.pointIsBetweenPoints(point, this.point1, this.point2)
    }
    public intersectsLineSegment(other: LineSegment): boolean{
        if(this.isContainedByLineSegment(other) || other.isContainedByLineSegment(this)){
            return true;
        }
        if(!this.lineSegmentIsOnSameLine(other)){
            return false;
        }
        const {point1, point2} = this.getPointsInSameDirection(other.point1, other.point2);
        return !this.comesBefore(point2, this.point1) && !this.comesBefore(this.point2, point1);
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean {
        if(this.isContainedByConvexPolygon(other)){
            return true;
        }
        const intersections: HalfPlaneLineIntersection[] = other.intersectWithLine(this.point1, this.point2.minus(this.point1));
        for(let intersection of intersections){
            if(this.containsPoint(intersection.point)){
                return true;
            }
        }
        return false;
    }
    public intersects(other: Area): boolean {
        return other.intersectsLineSegment(this);
    }
    public expandToIncludePoint(point: Point): Area {
        if(this.containsPoint(point)){
            return this;
        }
        if(this.pointIsOnSameLine(point)){
            if(this.comesBefore(point, this.point1)){
                return new LineSegment(point, this.point2);
            }
            return new LineSegment(this.point1, point);
        }
        return ConvexPolygon.createTriangle(this.point1, point, this.point2);
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