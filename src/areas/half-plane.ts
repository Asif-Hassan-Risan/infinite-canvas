import { Area } from "./area";
import { Point } from "../point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";
import { PathInstruction } from "../interfaces/path-instruction";

export class HalfPlane implements Area{
    private readonly lengthOfNormal: number;
    constructor(public readonly base: Point, public readonly normalTowardInterior: Point){
        this.lengthOfNormal = Math.sqrt(normalTowardInterior.x * normalTowardInterior.x + normalTowardInterior.y * normalTowardInterior.y);
    }
    public getDistanceFromEdge(point: Point): number{
        const pointToBaseX: number = point.x - this.base.x;
        const pointToBaseY: number = point.y - this.base.y;
        return (pointToBaseX * this.normalTowardInterior.x + pointToBaseY * this.normalTowardInterior.y) / this.lengthOfNormal;
    }
    public transform(transformation: Transformation): Area {
        return new HalfPlane(transformation.apply(this.base), transformation.untranslated().apply(this.normalTowardInterior));
    }
    public intersectWith(area: Area): Area {
        throw new Error("Method not implemented.");
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        throw new Error("Method not implemented.");
    }
    public contains(area: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public containsPoint(point: Point): boolean {
        return this.getDistanceFromEdge(point) >= 0;
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        const normalsSameDirection: boolean = this.normalTowardInterior.x * halfPlane.normalTowardInterior.y - this.normalTowardInterior.y * halfPlane.normalTowardInterior.x === 0;
        const baseHasPositiveDistance = halfPlane.getDistanceFromEdge(this.base) > 0;
        return normalsSameDirection && baseHasPositiveDistance;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return false;
    }
    public intersects(area: Area): boolean {
        throw new Error("Method not implemented.");
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    public getInstructionToClear(): PathInstruction {
        throw new Error("Method not implemented.");
    }
}