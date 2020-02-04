import { ConvexPolygon } from "../src/areas/convex-polygon";
import { HalfPlane } from "../src/areas/half-plane";
import { Point } from "../src/geometry/point";

describe("a convex polygon", () => {
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

    it("should have the correct border points", () => {
        expect(convexPolygon.borderPoints.length).toBe(2);
        const borderPointsLeftOfYAxis: Point[] = convexPolygon.borderPoints.filter(p => p.x < 0);
        expect(borderPointsLeftOfYAxis.length).toBe(1);
        const pointLeftOfYAxis: Point = borderPointsLeftOfYAxis[0];
        expect(pointLeftOfYAxis.x).toBeCloseTo(-1);
        expect(pointLeftOfYAxis.y).toBeCloseTo(-1);

        const borderPointsRightOfYAxis: Point[] = convexPolygon.borderPoints.filter(p => p.x > 0);
        expect(borderPointsRightOfYAxis.length).toBe(1);
        const pointRightOfYAxis: Point = borderPointsRightOfYAxis[0];
        expect(pointRightOfYAxis.x).toBeCloseTo(1);
        expect(pointRightOfYAxis.y).toBeCloseTo(-1);
    });

    it("should have the correct half planes", () => {
        expect(convexPolygon.halfPlanes.length).toBe(3);
    });
});