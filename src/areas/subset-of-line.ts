import { Point } from "../geometry/point";

export abstract class SubsetOfLine{
    constructor(protected base: Point, protected direction: Point){}
    protected pointIsOnSameLine(point: Point): boolean{
        return point.minus(this.base).cross(this.direction) === 0;
    }
    protected comesBefore(point1: Point, point2: Point): boolean{
        return point2.minus(point1).dot(this.direction) >= 0;
    }
}