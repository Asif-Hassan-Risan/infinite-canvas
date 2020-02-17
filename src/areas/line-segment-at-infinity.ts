import { Point } from "../geometry/point";

export class LineSegmentAtInfinity{
    constructor(public readonly direction1: Point, public readonly direction2: Point){}
    public addPointAtInfinity(direction: Point): LineSegmentAtInfinity{
        if(direction.isInSmallerAngleBetweenPoints(this.direction1, this.direction2)){
            return this;
        }

    }
}