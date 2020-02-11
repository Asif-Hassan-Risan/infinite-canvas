import { ViewBoxInfinity } from "../src/viewbox-infinity";
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";

describe("a viewbox infinity", () => {
    let infinity: ViewBoxInfinity;

    beforeEach(() => {
        infinity = new ViewBoxInfinity(10, 10, Transformation.identity);
    });

    it.each([
        [infinity.getInfinityFromPointInDirection(new Point(0, 0), new Point(0, 1), Transformation.identity), new Point(0, 10)],
        [infinity.getInfinityFromPointInDirection(new Point(0, 0), new Point(0, 1), Transformation.scale(2)), new Point(0, 10)]
    ])("should return the right infinities along the x and y axes", (calculated: Point, expected: Point) => {
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});