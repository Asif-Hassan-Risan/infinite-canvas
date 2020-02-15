import { HalfPlane } from "../src/areas/half-plane";
import { ConvexPolygon } from "../src/areas/convex-polygon";
import { LineSegment } from "../src/areas/line-segment";
import { Area } from "../src/areas/area";
import { plane } from "../src/areas/plane";
import { empty } from "../src/areas/empty";

function halfPlanesAreEqual(one: HalfPlane, other: HalfPlane): boolean{
    return one.normalTowardInterior.inSameDirectionAs(other.normalTowardInterior) && one.base.minus(other.base).dot(other.normalTowardInterior) === 0;
}
function expectPolygonsToBeEqual(one: ConvexPolygon, other: ConvexPolygon): void{
    expect(one.halfPlanes.length).toBe(other.halfPlanes.length);
    for(let oneHalfPlane of one.halfPlanes){
        expect(!!other.halfPlanes.find(p => halfPlanesAreEqual(oneHalfPlane, p))).toBe(true);
    }
}
function expectLineSegmentsToBeEqual(one: LineSegment, other: LineSegment): void{
    const pointsArrangedTheSame: boolean = one.point1.equals(other.point1) && one.point2.equals(other.point2);
    const pointsArrangedOpposite: boolean = one.point1.equals(other.point2) && one.point2.equals(other.point1);
    expect(pointsArrangedTheSame || pointsArrangedOpposite).toBe(true);
}
function expectAreasToBeEqual(one: Area, other: Area): void{
    if(one instanceof ConvexPolygon){
        expect(other instanceof ConvexPolygon).toBe(true);
        expectPolygonsToBeEqual(one, other as ConvexPolygon);
    }else if(one instanceof LineSegment){
        expect(other instanceof LineSegment).toBe(true);
        expectLineSegmentsToBeEqual(one, other as LineSegment);
    }else if(one === plane){
        expect(other).toBe(plane);
    }else if(one === empty){
        expect(other).toBe(empty);
    }else if(!one){
        expect(other).toBeUndefined();
    }
}

export {expectAreasToBeEqual, expectLineSegmentsToBeEqual, expectPolygonsToBeEqual};