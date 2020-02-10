import { Area } from "./area";
import { HalfPlane } from "./half-plane";
import { Rectangle } from "./rectangle";
import { Point } from "../geometry/point";
import { PolygonVertex } from "./polygon-vertex";
import { plane } from "./plane";

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
    public expandToIncludePolygon(other: ConvexPolygon): Area{
        return ConvexPolygon.combinePolygons(this, other);
    }
    public expandToIncludePoint(point: Point): ConvexPolygon{
        let halfPlanes: HalfPlane[] = this.halfPlanes.filter(hp => hp.containsPoint(point)).concat(this.getTangentPlanesThroughPoint(point));
        halfPlanes = ConvexPolygon.getHalfPlanesNotContainingAnyOther(halfPlanes);
        return new ConvexPolygon(halfPlanes);
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): ConvexPolygon{
        if(convexPolygon.isContainedByConvexPolygon(this)){
            return convexPolygon;
        }
        if(this.isContainedByConvexPolygon(convexPolygon)){
            return this;
        }
        if(this.isOutsideConvexPolygon(convexPolygon)){
            return undefined;
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
    private hasAtMostOneVertex(halfPlane: HalfPlane): boolean{
        let count: number = 0;
        for(let vertex of this.vertices){
            if(vertex.halfPlane1 === halfPlane || vertex.halfPlane2 === halfPlane){
                count++;
                if(count > 1){
                    return false;
                }
            }
        }
        return true;
    }
    public getTangentPlanesThroughPoint(point: Point): HalfPlane[]{
        const result: HalfPlane[] = [];
        if(this.containsPoint(point)){
            for(let halfPlane of this.halfPlanes){
                if(halfPlane.containsPoint(point)){
                    result.push(halfPlane);
                }
            }
            return result;
        }
        for(let vertex of this.vertices){
            const throughVertex: HalfPlane[] = HalfPlane.withBorderPoints(vertex.point, point);
            for(let planeThroughVertex of throughVertex){
                if(this.isContainedByHalfPlane(planeThroughVertex)){
                    result.push(planeThroughVertex);
                }
            }
        }
        for(let halfPlane of this.halfPlanes){
            if(this.hasAtMostOneVertex(halfPlane) && !halfPlane.containsPoint(point)){
                result.push(halfPlane.expandToIncludePoint(point));
            }
        }
        return result;
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

    private static combinePolygons(one: ConvexPolygon, other: ConvexPolygon): Area{
        if(one.isContainedByConvexPolygon(other)){
            return other;
        }
        if(other.isContainedByConvexPolygon(one)){
            return one;
        }
        let halfPlanes: HalfPlane[] = one.halfPlanes.concat(other.halfPlanes).filter(hp => one.isContainedByHalfPlane(hp) && other.isContainedByHalfPlane(hp));
        for(let vertex1 of one.vertices){
            const tangentPlanes: HalfPlane[] = other.getTangentPlanesThroughPoint(vertex1.point);
            for(let tangentPlane of tangentPlanes){
                if(one.isContainedByHalfPlane(tangentPlane)){
                    halfPlanes.push(tangentPlane);
                }
            }
        }
        for(let vertex2 of other.vertices){
            const tangentPlanes: HalfPlane[] = one.getTangentPlanesThroughPoint(vertex2.point);
            for(let tangentPlane of tangentPlanes){
                if(other.isContainedByHalfPlane(tangentPlane)){
                    halfPlanes.push(tangentPlane);
                }
            }
        }
        halfPlanes = ConvexPolygon.getHalfPlanesNotContainingAnyOther(halfPlanes);
        if(halfPlanes.length === 0){
            return plane;
        }
        return new ConvexPolygon(halfPlanes);
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
        for(let halfPlane of halfPlanes){
            let include: boolean = true;
            for(let _halfPlane of result){
                if(_halfPlane.isContainedByHalfPlane(halfPlane)){
                    include = false;
                    break;
                }
            }
            if(include){
                result.push(halfPlane);
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