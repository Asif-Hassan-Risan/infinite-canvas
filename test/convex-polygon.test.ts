import { ConvexPolygon } from "../src/areas/convex-polygon";
import { HalfPlane } from "../src/areas/half-plane";
import { Point } from "../src/geometry/point";
import { PolygonVertex } from "../src/areas/polygon-vertex";

describe("a convex polygon with one half plane", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = new ConvexPolygon([new HalfPlane(new Point(0, -2), new Point(0, 1))]);
    });

    it.each([
        [new HalfPlane(new Point(0, -1), new Point(0, 1)), false],
        [new HalfPlane(new Point(0, -1), new Point(0, -1)), false],
        [new HalfPlane(new Point(0, -2), new Point(0, 1)), true],
        [new HalfPlane(new Point(0, -2), new Point(0, -1)), false],
        [new HalfPlane(new Point(0, -3), new Point(0, 1)), true],
        [new HalfPlane(new Point(0, -3), new Point(0, -1)), false]
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });
});

describe("a convex polygon with three half planes and two vertices", () => {
    let convexPolygon: ConvexPolygon;
    let halfPlane1: HalfPlane;
    let halfPlane2: HalfPlane;
    let halfPlane3: HalfPlane;

    beforeEach(() => {
        halfPlane1 = new HalfPlane(new Point(0, -1), new Point(0, -1));
        halfPlane2 = new HalfPlane(new Point(-2, -2), new Point(1, -1));
        halfPlane3 = new HalfPlane(new Point(2, -2), new Point(-1, -1));
        convexPolygon = new ConvexPolygon([halfPlane1, halfPlane2, halfPlane3]);
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
        [new HalfPlane(new Point(-2, -2), new Point(1, -1)), true],
        [new HalfPlane(new Point(-3, -2), new Point(1, -1)), true],
        [new HalfPlane(new Point(-1, -2), new Point(1, -1)), false],
        [new HalfPlane(new Point(0, -1), new Point(0, -1)), true],
        [new HalfPlane(new Point(0, -1), new Point(0, 1)), false],
        [new HalfPlane(new Point(0, 1), new Point(0, -1)), true],
        [new HalfPlane(new Point(0, 1), new Point(0, 1)), false],
        [new HalfPlane(new Point(0, -2), new Point(0, -1)), false],
        [new HalfPlane(new Point(0, -2), new Point(0, 1)), false],
        [new HalfPlane(new Point(-2, 0), new Point(1, 0)), false],
        [new HalfPlane(new Point(-2, 0), new Point(-1, 0)), false],
        [new HalfPlane(new Point(-1, 0), new Point(1, 0)), false],
        [new HalfPlane(new Point(-1, 0), new Point(-1, 0)), false],
        [new HalfPlane(new Point(0, 0), new Point(1, 0)), false],
        [new HalfPlane(new Point(0, 0), new Point(-1, 0)), false]
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(0, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(0, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1), new Point(0, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1), new Point(0, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -2), new Point(0, 1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -2), new Point(0, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(-1, 1)), new HalfPlane(new Point(0, 0), new Point(1, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1), new Point(-1, 1)), new HalfPlane(new Point(0, -1), new Point(1, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1.5), new Point(-1, 1)), new HalfPlane(new Point(0, -1.5), new Point(1, 1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -2), new Point(-1, 1)), new HalfPlane(new Point(0, -2), new Point(1, 1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -3), new Point(-1, 1)), new HalfPlane(new Point(0, -3), new Point(1, 1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(-2, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(-2, 0), new Point(-1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(-1, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(-1, 0), new Point(-1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(-1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(1, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(1, 0), new Point(-1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(2, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(2, 0), new Point(-1, 0))]), true]
    ])("should intersect the right convex polygons", (otherConvexPolygon: ConvexPolygon, expectedToIntersect: boolean) => {
        expect(convexPolygon.intersectsConvexPolygon(otherConvexPolygon)).toBe(expectedToIntersect);
        expect(otherConvexPolygon.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });
});

describe("a convex polygon with only one half plane", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(0, 1))]);
    });

    describe("when intersected with another with only one half plane that is parallel to it", () => {
        let other: ConvexPolygon;
        let intersection: ConvexPolygon;

        beforeEach(() => {
            other = new ConvexPolygon([new HalfPlane(new Point(0, 1), new Point(0, -1))]);
            intersection = convexPolygon.intersectWithConvexPolygon(other);
        });

        it("should result in one with two half planes", () => {
            expect(intersection.halfPlanes.length).toBe(2);
        });
    });
});

describe("a convex polygon with two half planes and no vertices", () => {
    let convexPolygon: ConvexPolygon;

    beforeEach(() => {
        convexPolygon = new ConvexPolygon([new HalfPlane(new Point(0, 1), new Point(0, -1)), new HalfPlane(new Point(0, -1), new Point(0, 1))]);
    });

    it("should have no vertices", () => {
        expect(convexPolygon.vertices.length).toBe(0);
    });
});

describe("a convex polygon with two half planes and one vertex", () => {
    let convexPolygon: ConvexPolygon;
    let halfPlane1: HalfPlane;
    let halfPlane2: HalfPlane;

    beforeEach(() => {
        halfPlane1 = new HalfPlane(new Point(0, 0), new Point(-1, -1));
        halfPlane2 = new HalfPlane(new Point(0, 0), new Point(1, -1));
        convexPolygon = new ConvexPolygon([halfPlane1, halfPlane2]);
    });

    describe("when intersected with a half plane the goes through the vertex", () => {
        let other: ConvexPolygon;
        let intersection: ConvexPolygon;

        beforeEach(() => {
            other = new ConvexPolygon([new HalfPlane(new Point(0, 1), new Point(1, 0))]);
            intersection = convexPolygon.intersectWithConvexPolygon(other);
        });

        it("should result in the correct convex polygon", () => {
            expect(intersection.halfPlanes.length).toBe(2);
            expect(intersection.vertices.length).toBe(1);
        });
    });

    it.each([
        [new HalfPlane(new Point(0, 1), new Point(0, -1)), true],
        [new HalfPlane(new Point(0, 1), new Point(0, 1)), false],
        [new HalfPlane(new Point(0, 0), new Point(0, -1)), true],
        [new HalfPlane(new Point(0, 0), new Point(0, 1)), false],
        [new HalfPlane(new Point(-1, 0), new Point(1, 0)), false],
        [new HalfPlane(new Point(-1, 0), new Point(-1, 0)), false],
        [new HalfPlane(new Point(0, 0), new Point(1, 0)), false],
        [new HalfPlane(new Point(0, 0), new Point(-1, 0)), false],
    ])("should be contained by the right half planes", (halfPlane: HalfPlane, expectedToContain: boolean) => {
        expect(convexPolygon.isContainedByHalfPlane(halfPlane)).toBe(expectedToContain);
    });

    it.each([
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(-1, 1)), new HalfPlane(new Point(0, 0), new Point(1, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, 1), new Point(-1, 1)), new HalfPlane(new Point(0, 1), new Point(1, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1), new Point(-1, 1)), new HalfPlane(new Point(0, -1), new Point(1, 1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(2, -1), new Point(-1, 1)), new HalfPlane(new Point(2, -1), new Point(1, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(2, -2), new Point(-1, 1)), new HalfPlane(new Point(2, -2), new Point(1, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(-1, -1)), new HalfPlane(new Point(0, 0), new Point(1, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(2, 0), new Point(-1, -1)), new HalfPlane(new Point(2, 0), new Point(1, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 2), new Point(-1, -1)), new HalfPlane(new Point(0, 2), new Point(1, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -2), new Point(-1, -1)), new HalfPlane(new Point(0, -2), new Point(1, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(0, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(0, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1), new Point(0, 1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, -1), new Point(0, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 1), new Point(0, 1))]), false],
        [new ConvexPolygon([new HalfPlane(new Point(0, 1), new Point(0, -1))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(0, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(1, 0), new Point(1, 0))]), true],
        [new ConvexPolygon([new HalfPlane(new Point(-1, 0), new Point(1, 0))]), true]
    ])("should intersect the right convex polygons", (otherConvexPolygon: ConvexPolygon, expectedToIntersect: boolean) => {
        expect(convexPolygon.intersectsConvexPolygon(otherConvexPolygon)).toBe(expectedToIntersect);
        expect(otherConvexPolygon.intersectsConvexPolygon(convexPolygon)).toBe(expectedToIntersect);
    });
});