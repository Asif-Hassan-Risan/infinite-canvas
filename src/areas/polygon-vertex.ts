import { Point } from "../geometry/point";

export class PolygonVertex{
    constructor(public readonly point: Point, public readonly normal1: Point, public readonly normal2: Point){}
    public isContainedByHalfPlaneWithNormal(normal: Point): boolean{
        if(this.normal1.cross(this.normal2) > 0){
            return this.normal1.cross(normal) >= 0 && normal.cross(this.normal2) >= 0;
        }
        return this.normal1.cross(normal) <= 0 && normal.cross(this.normal2) <= 0;
    }
}