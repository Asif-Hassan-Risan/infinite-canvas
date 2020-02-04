import { Area } from "./area";
import { HalfPlane } from "./half-plane";
import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";

export class ConvexPolygon implements Area{
    public readonly borderPoints: Point[];
    public readonly halfPlanes: HalfPlane[];
    constructor(halfPlanes: HalfPlane[]){
        this.halfPlanes = halfPlanes;
        this.borderPoints = ConvexPolygon.getBorderPoints(this.halfPlanes);
    }
    public intersectWith(area: Area): Area {
        return area.intersectWithConvexPolygon(this);
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        throw new Error("Method not implemented.");
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        for(let borderPoint of this.borderPoints){
            if(!halfPlane.containsPoint(borderPoint)){
                return false;
            }
        }
        for(let _halfPlane of this.halfPlanes){
            if(_halfPlane.isContainedByHalfPlane(halfPlane)){
                return true;
            }
            
        }
        throw new Error("Method not implemented.");
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
    private static getHalfPlanes(halfPlanes: HalfPlane[]): HalfPlane[]{
        const result: HalfPlane[] = [];
        for(let i: number = 0; i < halfPlanes.length; i++){
            let include: boolean = true;
            for(let j: number = 0; j < halfPlanes.length; j++){
                if(i === j){
                    continue;
                }
                if(halfPlanes[j].isContainedByHalfPlane(halfPlanes[i])){
                    include = false;
                    break;
                }
            }
            if(include){
                result.push(halfPlanes[i]);
            }
        }
        return result;
    }
    private static getBorderPoints(halfPlanes: HalfPlane[]): Point[]{
        const result: Point[] = [];
        for(let i: number = 0; i < halfPlanes.length; i++){
            for(let j: number = i + 1; j < halfPlanes.length; j++){
                const candidate: Point = halfPlanes[i].getIntersectionWith(halfPlanes[j]);
                let include: boolean = true;
                for(let k: number = 0; k < halfPlanes.length; k++){
                    if(k !== i && k !== j && !halfPlanes[k].containsPoint(candidate)){
                        include = false;
                        break;
                    }
                }
                if(include){
                    result.push(candidate);
                }
            }
        }
        return result;
    }
}