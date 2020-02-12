import { Point } from "../geometry/point";

export class Ray{
    constructor(private readonly base: Point, private readonly direction: Point){}
}