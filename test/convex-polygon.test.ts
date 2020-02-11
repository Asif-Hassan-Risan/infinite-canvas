import { ConvexPolygon } from "../src/areas/convex-polygon";
import { HalfPlane } from "../src/areas/half-plane";
import { Point } from "../src/geometry/point";
import { PolygonVertex } from "../src/areas/polygon-vertex";
import { Area } from "../src/areas/area";
import { plane } from "../src/areas/plane";
import { Rectangle } from "../src/areas/rectangle";
import { Transformation } from "../src/transformation";

function halfPlanesAreEqual(one: HalfPlane, other: HalfPlane): boolean{
    return one.normalTowardInterior.inSameDirectionAs(other.normalTowardInterior) && one.base.minus(other.base).dot(other.normalTowardInterior) === 0;
}
function expectPolygonsToBeEqual(one: ConvexPolygon, other: ConvexPolygon): void{
    expect(one.halfPlanes.length).toBe(other.halfPlanes.length);
    for(let oneHalfPlane of one.halfPlanes){
        expect(!!other.halfPlanes.find(p => halfPlanesAreEqual(oneHalfPlane, p))).toBe(true);
    }
}
function expectAreasToBeEqual(one: Area, other: Area): void{
    if(one instanceof ConvexPolygon){
        expect(other instanceof ConvexPolygon).toBe(true);
        expectPolygonsToBeEqual(one, other as ConvexPolygon);
    }else if(one === plane){
        expect(other).toBe(plane);
    }else if(!one){
        expect(other).toBeUndefined();
    }
}
function hp(builder: (builder: HalfPlaneBuilder) => HalfPlaneBuilder): HalfPlane{
    return builder(new HalfPlaneBuilder()).build();
}
function p(builder: (builder: PolygonBuilder) => PolygonBuilder): ConvexPolygon{
    return builder(new PolygonBuilder()).build();
}
class PolygonBuilder{
    private halfPlanes: HalfPlane[] = [];
    public build(): ConvexPolygon{
        return new ConvexPolygon(this.halfPlanes);
    }
    public with(halfPlaneBuilder: (builder: HalfPlaneBuilder) => HalfPlaneBuilder): PolygonBuilder{
        this.halfPlanes.push(hp(halfPlaneBuilder));
        return this;
    }
}
class HalfPlaneBuilder{
    private _base: Point;
    private normalTowardInterior: Point;
    public build(): HalfPlane{
        return new HalfPlane(this._base, this.normalTowardInterior);
    }
    public base(x: number, y: number): HalfPlaneBuilder{
        this._base = new Point(x, y);
        return this;
    }
    public normal(x: number, y: number): HalfPlaneBuilder{
        this.normalTowardInterior = new Point(x, y);
        return this;
    }
}

describe("a rectangle", () => {
    let rectangle: ConvexPolygon;

    beforeEach(() => {
        rectangle = Rectangle.create(0, 0, 1, 1);
    });

    it("should be transformed the right way", () => {
        const transformed: ConvexPolygon = rectangle.transform(new Transformation(1, 1, 0, 1, 0, 0));
        expectPolygonsToBeEqual(transformed, p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(0, 0).normal(-1, 1))
            .with(hp => hp.base(1, 2).normal(-1, 0))
            .with(hp => hp.base(1, 2).normal(1, -1))));
    });
});

describe("a convex polygon with one half plane", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = new PolygonBuilder().with(hp => hp.base(0, -2).normal(0, 1)).build();
    });

    it.each([
        [hp(b => b.base(0, -1).normal(0, 1)), false],
        [hp(b => b.base(0, -1).normal(0, -1)), false],
        [hp(b => b.base(0, -2).normal(0, 1)), true],
        [hp(b => b.base(0, -2).normal(0, -1)), false],
        [hp(b => b.base(0, -3).normal(0, 1)), true],
        [hp(b => b.base(0, -3).normal(0, -1)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });
});

describe("a convex polygon with three half planes and two vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = new PolygonBuilder()
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .build();
    });

    it("should have the correct vertices", () => {
        expect(convexPolygon.vertices.length).toBe(2);
        const borderPointsLeftOfYAxis: PolygonVertex[] = convexPolygon.vertices.filter(v => v.point.x < 0);
        expect(borderPointsLeftOfYAxis.length).toBe(1);
        const pointLeftOfYAxis: PolygonVertex = borderPointsLeftOfYAxis[0];
        expect(pointLeftOfYAxis.point.x).toBeCloseTo(-1);
        expect(pointLeftOfYAxis.point.y).toBeCloseTo(-1);

        const borderPointsRightOfYAxis: PolygonVertex[] = convexPolygon.vertices.filter(v => v.point.x > 0);
        expect(borderPointsRightOfYAxis.length).toBe(1);
        const pointRightOfYAxis: PolygonVertex = borderPointsRightOfYAxis[0];
        expect(pointRightOfYAxis.point.x).toBeCloseTo(1);
        expect(pointRightOfYAxis.point.y).toBeCloseTo(-1);
    });

    it("should have the correct half planes", () => {
        expect(convexPolygon.halfPlanes.length).toBe(3);
    });

    it.each([
        [p(p => p
            .with(hp => hp.base(0, -0.5).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(0.5, -1))
            .with(hp => hp.base(0, -0.5).normal(-0.5, -1)))],

        [p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))],

        [p(p => p
            .with(hp => hp.base(-2, -1).normal(-1, -1))
            .with(hp => hp.base(-2, -1).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(-2, -1).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],

        [p(p => p
            .with(hp => hp.base(-2, 0).normal(-1, -1))
            .with(hp => hp.base(-2, 0).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(-2, 0).normal(1, -1))
            .with(hp => hp.base(-2, 0).normal(-1, -3))
            .with(hp => hp.base(2, -2).normal(-1, -1)))]
    ])("should result in the correct expansions with a polygon", (expandWith: ConvexPolygon, expectedExpansion: ConvexPolygon) => {
        expectAreasToBeEqual(convexPolygon.expandToIncludePolygon(expandWith), expectedExpansion);
        expectAreasToBeEqual(expandWith.expandToIncludePolygon(convexPolygon), expectedExpansion);
    });

    it.each([
        [new Point(-2, -1), p(p => p
            .with(hp => hp.base(-3, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],
        [new Point(0, -0.5), p(p => p
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(0.5, -1))
            .with(hp => hp.base(0, -0.5).normal(-0.5, -1)))],
        [new Point(0, 0), p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))],
        [new Point(0, 1), p(p => p
            .with(hp => hp.base(0, 1).normal(-1, -1))
            .with(hp => hp.base(0, 1).normal(1, -1)))]
    ])("should result in the correct expansions with a point", (expandWith: Point, expectedExpansion: ConvexPolygon) => {
        expectPolygonsToBeEqual(convexPolygon.expandToIncludePoint(expandWith), expectedExpansion);
    });

    it.each([
        //intersect with a half-plane with a horizontal border
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), undefined],

        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],

        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), undefined],

        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],

        [p(p => p.with(hp => hp.base(0, -2).normal(0, 1))), p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1))
            .with(hp => hp.base(0, -2).normal(0, 1)))],

        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), p(p => p
            .with(hp => hp.base(0, -2).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        //intersect with a half-plane with a vertical border
        [p(p => p
            .with(hp => hp.base(-2, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(-2, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1)))],
        
        [p(p => p
            .with(hp => hp.base(-1, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(-1, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1)))],

        [p(p => p
            .with(hp => hp.base(0, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],
        
        [p(p => p
            .with(hp => hp.base(1, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(1, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],
        
        [p(p => p
            .with(hp => hp.base(2, 0).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(2, 0).normal(-1, 0))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        //two half planes, vertex directed upwards
        [p(p => p
            .with(hp => hp.base(0, -2).normal(-1, -1))
            .with(hp => hp.base(0, -2).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -2).normal(-1, -1))
            .with(hp => hp.base(0, -2).normal(1, -1)))],
        
        [p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1)))],

        [p(p => p
            .with(hp => hp.base(0, -0.5).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -0.5).normal(-1, -1))
            .with(hp => hp.base(0, -0.5).normal(1, -1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],

        [p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))],
        
        // two half planes, vertex directed downwards
        [p(p => p
            .with(hp => hp.base(0, -1).normal(1, 1))
            .with(hp => hp.base(0, -1).normal(-1, 1))), undefined],

        [p(p => p
            .with(hp => hp.base(0, -1.5).normal(1, 1))
            .with(hp => hp.base(0, -1.5).normal(-1, 1))),
        p(p => p
            .with(hp => hp.base(0, -1.5).normal(1, 1))
            .with(hp => hp.base(0, -1.5).normal(-1, 1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],

        [p(p => p
            .with(hp => hp.base(0, -2).normal(1, 1))
            .with(hp => hp.base(0, -2).normal(-1, 1))),
        p(p => p
            .with(hp => hp.base(0, -2).normal(1, 1))
            .with(hp => hp.base(0, -2).normal(-1, 1))
            .with(hp => hp.base(0, -1).normal(0, -1)))],

        [p(p => p
            .with(hp => hp.base(0, -3).normal(1, 1))
            .with(hp => hp.base(0, -3).normal(-1, 1))),
        p(p => p
            .with(hp => hp.base(0, -3).normal(1, 1))
            .with(hp => hp.base(0, -3).normal(-1, 1))
            .with(hp => hp.base(0, -1).normal(0, -1))
            .with(hp => hp.base(-2, -2).normal(1, -1))
            .with(hp => hp.base(2, -2).normal(-1, -1)))]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });

    it.each([
        [hp(b => b.base(-2, -2).normal(1, -1)), true],
        [hp(b => b.base(-3, -2).normal(1, -1)), true],
        [hp(b => b.base(-1, -2).normal(1, -1)), false],
        [hp(b => b.base(0, -1).normal(0, -1)), true],
        [hp(b => b.base(0, -1).normal(0, 1)), false],
        [hp(b => b.base(0, 1).normal(0, -1)), true],
        [hp(b => b.base(0, 1).normal(0, 1)), false],
        [hp(b => b.base(0, -2).normal(0, -1)), false],
        [hp(b => b.base(0, -2).normal(0, 1)), false],
        [hp(b => b.base(-2, 0).normal(1, 0)), false],
        [hp(b => b.base(-2, 0).normal(-1, 0)), false],
        [hp(b => b.base(-1, 0).normal(1, 0)), false],
        [hp(b => b.base(-1, 0).normal(-1, 0)), false],
        [hp(b => b.base(0, 0).normal(1, 0)), false],
        [hp(b => b.base(0, 0).normal(-1, 0)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, 1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, 1)).with(hp => hp.base(0, 0).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1).normal(-1, 1)).with(hp => hp.base(0, -1).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1.5).normal(-1, 1)).with(hp => hp.base(0, -1.5).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(-1, 1)).with(hp => hp.base(0, -2).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(0, -3).normal(-1, 1)).with(hp => hp.base(0, -3).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(-2, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(-2, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(-1, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(-1, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(1, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(1, 0).normal(-1, 0))), true],
        [p(p => p.with(hp => hp.base(2, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(2, 0).normal(-1, 0))), true],
    ])("should intersect the right convex polygons", (otherConvexPolygon: ConvexPolygon, expectedToIntersect: boolean) => {
        expect(convexPolygon.intersectsConvexPolygon(otherConvexPolygon)).toBe(expectedToIntersect);
        expect(otherConvexPolygon.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });
});

describe("a convex polygon with three half planes and three vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(-1, 0).normal(1, -1))
            .with(hp => hp.base(1, 0).normal(-1, -1)))
    });

    it.each([
        [hp(hp => hp.base(0, 2).normal(0, -1)), true],
        [hp(hp => hp.base(0, -2).normal(0, 1)), true]
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });
});

describe("a convex polygon with only one half plane", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p.with(hp => hp.base(0, 0).normal(0, 1)));
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p.with(hp => hp.base(0, -1).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 1))), plane],
        [p(p => p
            .with(hp => hp.base(0, 1).normal(1, 1))
            .with(hp => hp.base(0, 1).normal(-1, 1))),
        p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [p(p => p
            .with(hp => hp.base(0, 0).normal(1, 1))
            .with(hp => hp.base(0, 0).normal(-1, 1))),
        p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [p(p => p
            .with(hp => hp.base(0, -1).normal(1, 1))
            .with(hp => hp.base(0, -1).normal(-1, 1))),
        p(p => p.with(hp => hp.base(0, -1).normal(0, 1)))],
        [p(p => p
            .with(hp => hp.base(0, -1).normal(0, 1))
            .with(hp => hp.base(0, -1).normal(1, 0))),
        p(p => p.with(hp => hp.base(0, -1).normal(0, 1)))],
        [p(p => p
            .with(hp => hp.base(0, -1).normal(1, 10))
            .with(hp => hp.base(0, -1).normal(1, 0))),
        plane]
    ])("should result in the correct expansions with a polygon", (expandWith: ConvexPolygon, expectedExpansion: ConvexPolygon) => {
        expectAreasToBeEqual(convexPolygon.expandToIncludePolygon(expandWith), expectedExpansion);
        expectAreasToBeEqual(expandWith.expandToIncludePolygon(convexPolygon), expectedExpansion);
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 1).normal(0, -1))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)).with(hp => hp.base(0, 1).normal(0, -1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), p(p => p.with(hp => hp.base(0, 1).normal(0, 1)))],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 0))), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)).with(hp => hp.base(0, 0).normal(1, 0)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), undefined]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });
});

describe("a convex polygon with two half planes and no vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(0, -1).normal(0, 1)));
    });

    it("should have no vertices", () => {
        expect(convexPolygon.vertices.length).toBe(0);
    });

    it.each([
        [hp(hp => hp.base(0, 2).normal(0, -1)), true],
        [hp(hp => hp.base(0, 2).normal(0, 1)), false],
        [hp(hp => hp.base(0, -2).normal(0, 1)), true],
        [hp(hp => hp.base(0, -2).normal(0, -1)), false]
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))),
        p(p => p
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(0, -1).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, 0)))],
        
        [p(p => p.with(hp => hp.base(0, 2).normal(0, 1))), undefined],
        [p(p => p.with(hp => hp.base(0, -2).normal(0, -1))), undefined],
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });
});

describe("a convex polygon with two half planes and one vertex", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = p(p => p.with(hp => hp.base(0, 0).normal(-1, -1)).with(hp => hp.base(0, 0).normal(1, -1)));
    });

    it.each([
        [p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p
            .with(hp => hp.base(-1, 0).normal(-1, -1))
            .with(hp => hp.base(-1, 0).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(-1, 0).normal(1, -1))
            .with(hp => hp.base(0, 0).normal(-1, -1)))],
        [p(p => p
            .with(hp => hp.base(-1, 0).normal(-1, -1))
            .with(hp => hp.base(-1, 0).normal(1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(-1, 0).normal(1, -1))
            .with(hp => hp.base(0, 0).normal(-1, -1)))],
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-2, -1))
            .with(hp => hp.base(0, 1).normal(2, -1))),
        p(p => p
            .with(hp => hp.base(0, 1).normal(1, -1))
            .with(hp => hp.base(0, 1).normal(-1, -1)))]
    ])("should result in the correct expansions with a polygon", (expandWith: ConvexPolygon, expectedExpansion: ConvexPolygon) => {
        expectAreasToBeEqual(convexPolygon.expandToIncludePolygon(expandWith), expectedExpansion);
        expectAreasToBeEqual(expandWith.expandToIncludePolygon(convexPolygon), expectedExpansion);
    });

    it.each([
        [new Point(-1, 0), p(p => p
            .with(hp => hp.base(0, 0).normal(0, -1))
            .with(hp => hp.base(-1, 0).normal(1, -1))
            .with(hp => hp.base(0, 0).normal(-1, -1)))]
    ])("should result in the correct expansions with a point", (expandWith: Point, expectedExpansion: ConvexPolygon) => {
        expectPolygonsToBeEqual(convexPolygon.expandToIncludePoint(expandWith), expectedExpansion);
    });

    it.each([
        //intersect with a half-plane with a vertical border
        [p(p => p.with(hp => hp.base(0, 1).normal(1, 0))), p(p => p
                                                            .with(hp => hp.base(0, 0).normal(-1, -1))
                                                            .with(hp => hp.base(0, 1).normal(1, 0)))],
        [p(p => p.with(hp => hp.base(-1, 1).normal(1, 0))), p(p => p
                                                                .with(hp => hp.base(0, 0).normal(-1, -1))
                                                                .with(hp => hp.base(-1, 1).normal(1, 0))
                                                                .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(1, 1).normal(1, 0))), p(p => p
                                                            .with(hp => hp.base(0, 0).normal(-1, -1))
                                                            .with(hp => hp.base(1, 1).normal(1, 0)))],

        //intersect with a half-plane with a horizontal border
        [p(p => p.with(hp => hp.base(0, 1).normal(0, -1))), p(p => p
                                                            .with(hp => hp.base(0, 0).normal(-1, -1))
                                                            .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), p(p => p
                                                                .with(hp => hp.base(0, 0).normal(-1, -1))
                                                                .with(hp => hp.base(0, -1).normal(0, -1))
                                                                .with(hp => hp.base(0, 0).normal(1, -1)))],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), p(p => p
                                                                    .with(hp => hp.base(0, 0).normal(-1, -1))
                                                                    .with(hp => hp.base(0, -1).normal(0, 1))
                                                                    .with(hp => hp.base(0, 0).normal(1, -1)))],
        //intersect with two half-planes, vertex pointing upwards
        [p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1))),
        p(p => p
            .with(hp => hp.base(0, -1).normal(-1, -1))
            .with(hp => hp.base(0, -1).normal(1, -1)))],

        //intersect with two half-planes forming a 'top-right' corner
        [p(p => p
            .with(hp => hp.base(0, 1).normal(0, -1))
            .with(hp => hp.base(0, 1).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(0, 1).normal(-1, 0)))],

        [p(p => p
            .with(hp => hp.base(3, -1).normal(0, -1))
            .with(hp => hp.base(3, -1).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(0, 0).normal(-1, -1))
            .with(hp => hp.base(3, -1).normal(0, -1))
            .with(hp => hp.base(3, -1).normal(-1, 0)))],

        [p(p => p
            .with(hp => hp.base(1, -1).normal(0, -1))
            .with(hp => hp.base(1, -1).normal(-1, 0))),
        p(p => p
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(1, -1).normal(0, -1))
            .with(hp => hp.base(1, -1).normal(-1, 0)))],

        //intersect with two half-planes forming a 'bottom-left' corner
        [p(p => p
            .with(hp => hp.base(0, 1).normal(0, 1))
            .with(hp => hp.base(0, 1).normal(1, 0))), undefined],

        //intersect with two half-planes, vertex pointing right
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-1, -1))
            .with(hp => hp.base(0, 1).normal(-1, 1))), undefined],
        
        //intersect with two half-planes, vertex pointing down
        [p(p => p
            .with(hp => hp.base(0, 1).normal(-1, 1))
            .with(hp => hp.base(0, 1).normal(1, 1))), undefined],
        
        //intersect with one half-plane parallel to one of the borders
        [p(p => p.with(hp => hp.base(-1, -1).normal(-1, -1))),
        p(p => p
            .with(hp => hp.base(-1, -1).normal(-1, -1))
            .with(hp => hp.base(0, 0).normal(1, -1)))]
    ])("should result in the correct intersections", (other: ConvexPolygon, expectedIntersection: ConvexPolygon) => {
        const intersection: ConvexPolygon = convexPolygon.intersectWithConvexPolygon(other);
        if(!expectedIntersection){
            expect(intersection).toBeUndefined();
        }else{
            expectPolygonsToBeEqual(intersection, expectedIntersection);
        }
    });

    it.each([
        [hp(b => b.base(0, 1).normal(0, -1)), true],
        [hp(b => b.base(0, 1).normal(0, 1)), false],
        [hp(b => b.base(0, 0).normal(0, -1)), true],
        [hp(b => b.base(0, 0).normal(0, 1)), false],
        [hp(b => b.base(-1, 0).normal(1, 0)), false],
        [hp(b => b.base(-1, 0).normal(-1, 0)), false],
        [hp(b => b.base(0, 0).normal(1, 0)), false],
        [hp(b => b.base(0, 0).normal(-1, 0)), false],
        [hp(b => b.base(1, 0).normal(1, -1)), false],
        [hp(b => b.base(1, 0).normal(-1, 1)), false],
        [hp(b => b.base(1, 0).normal(1, 1)), false],
        [hp(b => b.base(1, 0).normal(-1, -1)), true],
        [hp(b => b.base(-1, 0).normal(-1, -1)), false],
        [hp(b => b.base(-1, 0).normal(1, 1)), false],
        [hp(b => b.base(-1, 0).normal(1, -1)), true],
        [hp(b => b.base(-1, 0).normal(-1, 1)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, 1)).with(hp => hp.base(0, 0).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, 1).normal(-1, 1)).with(hp => hp.base(0, 1).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, -1).normal(-1, 1)).with(hp => hp.base(0, -1).normal(1, 1))), true],
        [p(p => p.with(hp => hp.base(2, -1).normal(-1, 1)).with(hp => hp.base(2, -1).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(2, -2).normal(-1, 1)).with(hp => hp.base(2, -2).normal(1, 1))), false],
        [p(p => p.with(hp => hp.base(0, 0).normal(-1, -1)).with(hp => hp.base(0, 0).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(2, 0).normal(-1, -1)).with(hp => hp.base(2, 0).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(0, 2).normal(-1, -1)).with(hp => hp.base(0, 2).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(0, -2).normal(-1, -1)).with(hp => hp.base(0, -2).normal(1, -1))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, 0).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, 1))), true],
        [p(p => p.with(hp => hp.base(0, -1).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, 1))), false],
        [p(p => p.with(hp => hp.base(0, 1).normal(0, -1))), true],
        [p(p => p.with(hp => hp.base(0, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(1, 0).normal(1, 0))), true],
        [p(p => p.with(hp => hp.base(-1, 0).normal(1, 0))), true],
    ])("should intersect the right convex polygons", (otherConvexPolygon: ConvexPolygon, expectedToIntersect: boolean) => {
        expect(convexPolygon.intersectsConvexPolygon(otherConvexPolygon)).toBe(expectedToIntersect);
        expect(otherConvexPolygon.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });
});