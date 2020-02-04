import { Area } from "./area";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";

export class HalfPlane {
    private readonly lengthOfNormal: number;
    constructor(public readonly base: Point, public readonly normalTowardInterior: Point){
        this.lengthOfNormal = normalTowardInterior.mod();
    }
    public getDistanceFromEdge(point: Point): number{
        return point.minus(this.base).dot(this.normalTowardInterior) / this.lengthOfNormal;
    }
    public transform(transformation: Transformation): HalfPlane {
        return new HalfPlane(transformation.apply(this.base), transformation.untranslated().apply(this.normalTowardInterior));
    }
    public intersectWith(area: Area): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        throw new Error("Method not implemented.");
    }
    public containsPoint(point: Point): boolean {
        return this.getDistanceFromEdge(point) >= 0;
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        return this.normalTowardInterior.inSameDirectionAs(halfPlane.normalTowardInterior) && halfPlane.getDistanceFromEdge(this.base) > 0;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return false;
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    public getIntersectionWith(other: HalfPlane): Point{
        const d1: Point = this.normalTowardInterior.getPerpendicular();
        const d2: Point = other.normalTowardInterior.getPerpendicular();
        const q: Point = other.base.minus(this.base);
        const det: number = d2.cross(d1);
        const s: number = d2.getPerpendicular().dot(q) / det;
        return this.base.plus(d1.scale(s));
    }
}