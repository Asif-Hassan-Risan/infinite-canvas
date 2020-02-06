import { Area } from "./area";
import { HalfPlane } from "./half-plane";
import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";
import { PolygonVertex } from "./polygon-vertex";

export class ConvexPolygon implements Area{
    public readonly vertices: PolygonVertex[];
    public readonly halfPlanes: HalfPlane[];
    constructor(halfPlanes: HalfPlane[]){
        this.halfPlanes = halfPlanes;
        this.vertices = ConvexPolygon.getVertices(this.halfPlanes);
    }
    private findVertex(point: Point): PolygonVertex{
        for(let vertex of this.vertices){
            if(vertex.point.equals(point)){
                return vertex;
            }
        }
        return undefined;
    }
    public intersectWith(area: Area): Area {
        return area.intersectWithConvexPolygon(this);
    }
    public intersectWithRectangle(rectangle: Rectangle): Area {
        throw new Error("Method not implemented.");
    }
    private containsHalfPlane(halfPlane: HalfPlane): boolean{
        for(let _halfPlane of this.halfPlanes){
            if(!halfPlane.isContainedByHalfPlane(_halfPlane)){
                return false;
            }
        }
        return true;
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        for(let vertex of this.vertices){
            if(!halfPlane.containsPoint(vertex.point)){
                return false;
            }
        }
        const complement: HalfPlane = halfPlane.complement();
        for(let _halfPlane of this.halfPlanes){
            if(_halfPlane.isContainedByHalfPlane(complement) || complement.isContainedByHalfPlane(_halfPlane)){
                return false;
            }
            if(_halfPlane.isContainedByHalfPlane(halfPlane)){
                return true;
            }
            const intersection: Point = _halfPlane.getIntersectionWith(halfPlane);
            const vertexAtIntersection: PolygonVertex = this.findVertex(intersection);
            if(vertexAtIntersection){
                if(!vertexAtIntersection.isContainedByHalfPlaneWithNormal(halfPlane.normalTowardInterior)){
                    return false;
                }
            }else if(this.containsPoint(intersection)){
                return false;
            }
        }
        if(this.containsHalfPlane(halfPlane)){
            return false;
        }
        return true;
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
    public intersectsConvexPolygon(other: ConvexPolygon): boolean{
        if(this.isContainedByConvexPolygon(other) || other.isContainedByConvexPolygon(this)){
            return true;
        }
        return !this.isOutsideConvexPolygon(other);
    }
    private isOutsideConvexPolygon(other: ConvexPolygon): boolean{
        for(let otherHalfPlane of other.halfPlanes){
            if(this.isContainedByHalfPlane(otherHalfPlane.complement())){
                return true;
            }
        }
        for(let thisHalfPlane of this.halfPlanes){
            if(other.isContainedByHalfPlane(thisHalfPlane.complement())){
                return true;
            }
        }
        return false;
    }
    public isContainedByConvexPolygon(other: ConvexPolygon){
        for(let halfPlane of other.halfPlanes){
            if(!this.isContainedByHalfPlane(halfPlane)){
                return false;
            }
        }
        return true;
    }
    public intersectsRectangle(rectangle: Rectangle): boolean {
        throw new Error("Method not implemented.");
    }
    private static getVertices(halfPlanes: HalfPlane[]): PolygonVertex[]{
        const result: PolygonVertex[] = [];
        for(let i: number = 0; i < halfPlanes.length; i++){
            for(let j: number = i + 1; j < halfPlanes.length; j++){
                if(halfPlanes[i].complement().isContainedByHalfPlane(halfPlanes[j])){
                    continue;
                }
                const candidate: Point = halfPlanes[i].getIntersectionWith(halfPlanes[j]);
                let include: boolean = true;
                for(let k: number = 0; k < halfPlanes.length; k++){
                    if(k !== i && k !== j && !halfPlanes[k].containsPoint(candidate)){
                        include = false;
                        break;
                    }
                }
                if(include){
                    result.push(new PolygonVertex(candidate, halfPlanes[i].normalTowardInterior, halfPlanes[j].normalTowardInterior));
                }
            }
        }
        return result;
    }
}