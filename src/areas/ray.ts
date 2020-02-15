import { Point } from "../geometry/point";
import { Area } from "./area";
import { Transformation } from "../transformation";
import { ConvexPolygon } from "./convex-polygon";
import { LineSegment } from "./line-segment";
import { SubsetOfLine } from "./subset-of-line";

export class Ray extends SubsetOfLine implements Area{
    constructor(public base: Point, public direction: Point){
        super(base, direction);
    }
    public intersectWith(area: Area): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithLineSegment(lineSegment: LineSegment): Area {
        throw new Error("Method not implemented.");
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
    public intersectsConvexPolygon(other: ConvexPolygon): boolean {
        throw new Error("Method not implemented.");
    }
    public intersectsLineSegment(lineSegment: LineSegment): boolean {
        throw new Error("Method not implemented.");
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
    private containsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && this.comesBefore(this.base, point);
    }
}