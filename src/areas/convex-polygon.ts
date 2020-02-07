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
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): ConvexPolygon{
        if(convexPolygon.isContainedByConvexPolygon(this)){
            return convexPolygon;
        }
        if(this.isContainedByConvexPolygon(convexPolygon)){
            return this;
        }
        const allHalfPlanes: HalfPlane[] = ConvexPolygon.getHalfPlanesNotContainingAnyOther(this.halfPlanes.concat(convexPolygon.halfPlanes));
        const verticesGroupedByPoint: PolygonVertex[][] = ConvexPolygon.groupVerticesByPoint(ConvexPolygon.getVertices(allHalfPlanes));
        const notConainingAnyOtherByPoint: PolygonVertex[][] = verticesGroupedByPoint.map(g => ConvexPolygon.getVerticesNotContainingAnyOther(g));
        const allVertices: PolygonVertex[] = notConainingAnyOtherByPoint.reduce((a, b) => a.concat(b), []);
        if(allVertices.length === 0){
            return new ConvexPolygon(allHalfPlanes);
        }
        const halfPlanes: HalfPlane[] = ConvexPolygon.getHalfPlanes(allVertices);
        return new ConvexPolygon(halfPlanes);
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
    private static getHalfPlanes(vertices: PolygonVertex[]): HalfPlane[]{
        const result: HalfPlane[] = [];
        for(let vertex of vertices){
            if(result.indexOf(vertex.halfPlane1) === -1){
                result.push(vertex.halfPlane1);
            }
            if(result.indexOf(vertex.halfPlane2) === -1){
                result.push(vertex.halfPlane2);
            }
        }
        return result;
    }
    private static getVerticesNotContainingAnyOther(vertices: PolygonVertex[]): PolygonVertex[]{
        const result: PolygonVertex[] = [];
        for(let i: number = 0; i < vertices.length; i++){
            let include: boolean = true;
            for(let j: number = 0; j < vertices.length; j++){
                if(i === j){
                    continue;
                }
                if(vertices[j].isContainedByVertex(vertices[i])){
                    include = false;
                    break;
                }
            }
            if(include){
                result.push(vertices[i]);
            }
        }
        return result;
    }
    private static getHalfPlanesNotContainingAnyOther(halfPlanes: HalfPlane[]): HalfPlane[]{
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

    private static groupVerticesByPoint(vertices: PolygonVertex[]): PolygonVertex[][]{
        const groups: PolygonVertex[][] = [];
        for(let vertex of vertices){
            let group: PolygonVertex[];
            for(let existingGroup of groups){
                if(existingGroup[0].point.equals(vertex.point)){
                    group = existingGroup;
                    break;
                }
            }
            if(group){
                group.push(vertex);
            }else{
                groups.push([vertex]);
            }
        }
        return groups;
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
                    result.push(new PolygonVertex(candidate, halfPlanes[i], halfPlanes[j]));
                }
            }
        }
        return result;
    }
}