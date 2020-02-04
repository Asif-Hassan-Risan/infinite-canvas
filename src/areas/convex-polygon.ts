import { Area } from "./area";
import { HalfPlane } from "./half-plane";
import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";

export class ConvexPolygon implements Area{
    private borderPoints: Point[];
    constructor(public readonly halfPlanes: HalfPlane[]){
        this.borderPoints = this.getBorderPoints();
    }
    public intersectWith(area: Area): Area {
        return area.intersectWithConvexPolygon(this);
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        throw new Error("Method not implemented.");
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        throw new Error("Method not implemented.");
    }
    private getBorderPoints(): Point[]{
        const result: Point[] = [];

        return result;
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area{
        throw new Error("Method not implemented.");
    }
    public containsPoint(point: Point): boolean {
        for(let halfPlane of this.halfPlanes){
            if(!halfPlane.containsPoint(point)){
                return false;
            }
        }
        return true;
    }
    public isContainedByRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    
}