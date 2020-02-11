import { ViewBoxInfinity } from "../src/viewbox-infinity";
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";

describe("a viewbox infinity for an untransformed context", () => {
    let infinity: ViewBoxInfinity;

    beforeEach(() => {
        infinity = new ViewBoxInfinity(10, 10, Transformation.identity);
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 10)],
        [new Point(5, 5), new Point(0, 1), Transformation.identity, new Point(5, 10)],
        [new Point(0, 0), new Point(1, 0), Transformation.identity, new Point(10, 0)],
        [new Point(5, 5), new Point(1, 0), Transformation.identity, new Point(10, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.scale(2), new Point(0, 10)],
        [new Point(0, 0), new Point(0, 1), Transformation.rotation(0, 0, -Math.PI / 4), new Point(10, 10)]
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        const calculated: Point = infinity.getInfinityFromPointInDirection(fromPoint, inDirection, viewboxTransformation);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});

describe("a viewbox infinity for a scaled context", () => {
    let infinity: ViewBoxInfinity;

    beforeEach(() => {
        infinity = new ViewBoxInfinity(10, 10, Transformation.scale(2));
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 5)],
        [new Point(5, 5), new Point(0, 1), Transformation.identity, new Point(5, 5)],
        [new Point(0, 0), new Point(1, 0), Transformation.identity, new Point(5, 0)],
        [new Point(5, 5), new Point(1, 0), Transformation.identity, new Point(5, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.scale(2), new Point(0, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.rotation(0, 0, -Math.PI / 4), new Point(5, 5)]
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        const calculated: Point = infinity.getInfinityFromPointInDirection(fromPoint, inDirection, viewboxTransformation);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});