import { HalfPlane } from "../src/areas/half-plane";
import { Point } from "../src/geometry/point";

describe("a half plane", () => {
    let halfPlane: HalfPlane;

    beforeEach(() => {
        const normalTowardInterior: Point = new Point(1, -1);
        const base: Point = new Point(3, 2);
        halfPlane = new HalfPlane(base, normalTowardInterior);
    });

    it.each([
        [new Point(3, 4), -Math.sqrt(2)],
        [new Point(2, 2), -Math.sqrt(2) / 2],
        [new Point(5, 2), Math.sqrt(2)]
    ])("should return the correct distances from the edge", (point: Point, expectedDistance: number) => {
        expect(halfPlane.getDistanceFromEdge(point)).toBeCloseTo(expectedDistance);
    });
});

describe("two half planes with normals pointing in opposite directions", () => {
    let halfPlane1: HalfPlane;
    let halfPlane2: HalfPlane;

    beforeEach(() => {
        halfPlane1 = new HalfPlane(new Point(0, 1), new Point(0, -1));
        halfPlane2 = new HalfPlane(new Point(0, 0), new Point(0, 1));
    });

    it("should not contain each other", () => {
        expect(halfPlane1.isContainedByHalfPlane(halfPlane2)).toBe(false);
        expect(halfPlane2.isContainedByHalfPlane(halfPlane1)).toBe(false);
    });
});