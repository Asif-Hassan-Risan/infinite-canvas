import { HalfPlane } from "../src/areas/half-plane";
import { Point } from "../src/point";

describe("a half plane", () => {
    let halfPlane: HalfPlane;

    beforeEach(() => {
        const normalTowardInterior: Point = {x: 1, y : -1};
        const base: Point = {x: 3, y:2};
        halfPlane = new HalfPlane(base, normalTowardInterior);
    });

    it.each([
        [{x: 3, y: 4}, -Math.sqrt(2)],
        [{x: 2, y: 2}, -Math.sqrt(2) / 2],
        [{x: 5, y: 2}, Math.sqrt(2)]
    ])("should return the correct distances from the edge", (point: Point, expectedDistance: number) => {
        expect(halfPlane.getDistanceFromEdge(point)).toBeCloseTo(expectedDistance);
    });
});