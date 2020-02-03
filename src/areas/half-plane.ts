import { Area } from "./area";
import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";
import { Transformation } from "../transformation";
import { PathInstruction } from "../interfaces/path-instruction";

export class HalfPlane implements Area{
    private readonly lengthOfNormal: number;
    constructor(public readonly base: Point, public readonly normalTowardInterior: Point){
        this.lengthOfNormal = normalTowardInterior.mod();
    }
    public getDistanceFromEdge(point: Point): number{
        return point.minus(this.base).dot(this.normalTowardInterior) / this.lengthOfNormal;
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
        return this.normalTowardInterior.inSameDirectionAs(halfPlane.normalTowardInterior) && halfPlane.getDistanceFromEdge(this.base) > 0;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        return false;
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    public getInstructionToClear(): PathInstruction {
        throw new Error("Method not implemented.");
    }
}