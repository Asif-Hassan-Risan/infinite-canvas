import { InfiniteCanvasViewBoxInfinity } from "../src/infinite-canvas-viewbox-infinity";
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";

describe("a viewbox infinity for an untransformed context", () => {
    let infinity: InfiniteCanvasViewBoxInfinity;

    beforeEach(() => {
        infinity = new InfiniteCanvasViewBoxInfinity(10, 10, Transformation.identity);
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

describe("a viewbox infinity for a translated context", () => {
    let infinity: InfiniteCanvasViewBoxInfinity;

    beforeEach(() => {
        infinity = new InfiniteCanvasViewBoxInfinity(10, 10, new Transformation(1, 0, 0, 1, 5, 5));
    });

    it("should return the right infinity", () => {
        const result: Point = infinity.getInfinityFromPointInDirection(new Point(0, 0), new Point(1, 0), Transformation.identity);
        const expectedResult: Point = new Point(5, 0);
        expect(result.x).toBeCloseTo(expectedResult.x);
        expect(result.y).toBeCloseTo(expectedResult.y);
    });
});

describe("a viewbox infinity for skewed context", () => {
    let infinity: InfiniteCanvasViewBoxInfinity;

    beforeEach(() => {
        infinity = new InfiniteCanvasViewBoxInfinity(10, 10, new Transformation(1, 0.2, 0, 1, 0, 0));
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 10)],
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        const calculated: Point = infinity.getInfinityFromPointInDirection(fromPoint, inDirection, viewboxTransformation);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});

describe("a viewbox infinity for a scaled context", () => {
    let infinity: InfiniteCanvasViewBoxInfinity;

    beforeEach(() => {
        infinity = new InfiniteCanvasViewBoxInfinity(10, 10, Transformation.scale(2));
    });

    it.each([
        [new Point(0, 0), new Point(0, 1), Transformation.identity, new Point(0, 5)],
        [new Point(2, 2), new Point(0, 1), Transformation.identity, new Point(2, 5)],
        [new Point(0, 0), new Point(1, 0), Transformation.identity, new Point(5, 0)],
        [new Point(2, 2), new Point(1, 0), Transformation.identity, new Point(5, 2)],
        [new Point(0, 0), new Point(0, 1), Transformation.scale(2), new Point(0, 5)],
        [new Point(0, 0), new Point(0, 1), Transformation.rotation(0, 0, -Math.PI / 4), new Point(5, 5)]
    ])("should return the right infinities along the x and y axes", (fromPoint: Point, inDirection: Point, viewboxTransformation: Transformation, expected: Point) => {
        const calculated: Point = infinity.getInfinityFromPointInDirection(fromPoint, inDirection, viewboxTransformation);
        expect(calculated.x).toBeCloseTo(expected.x);
        expect(calculated.y).toBeCloseTo(expected.y);
    });
});