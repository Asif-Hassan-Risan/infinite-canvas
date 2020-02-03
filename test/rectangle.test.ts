import { Rectangle } from "../src/areas/rectangle";
import { Transformation } from "../src/transformation";
import { Point } from "../src/geometry/point";
import { Area } from "../src/areas/area";

describe("a rectangle", () => {
    let rectangle: Rectangle;

    beforeEach(() => {
        rectangle = new Rectangle(1, 1, 2, 2);
    });

    it.each([
        [{x:0,y:0}, 0, 3, 0, 3],
        [{x:4,y:0}, 1, 4, 0, 3],
        [{x:0,y:4}, 0, 3, 1, 4],
        [{x:4,y:4}, 1, 4, 1, 4]
    ])("should be expandable to include a point", (
        pointToInclude: Point,
        expectedLeft: number,
        expectedRight: number,
        expectedTop: number,
        expectedBottom: number) => {
            const newRectangle: Rectangle = rectangle.expandToIncludePoint(pointToInclude);
            const expectedRectangle: Rectangle = new Rectangle(expectedLeft, expectedTop, expectedRight - expectedLeft, expectedBottom - expectedTop);
            expect(newRectangle.isContainedByRectangle(expectedRectangle)).toBe(true);
            expect(expectedRectangle.isContainedByRectangle(newRectangle)).toBe(true);
    });

    it.each([
        [new Rectangle(0, 0, 1, 1), 0, 3, 0, 3],
        [new Rectangle(3, 0, 1, 1), 1, 4, 0, 3],
        [new Rectangle(0, 3, 1, 1), 0, 3, 1, 4],
        [new Rectangle(3, 3, 1, 1), 1, 4, 1, 4]
    ])("should be expandable to include a rectangle", (
        rectangleToInclude: Rectangle,
        expectedLeft: number,
        expectedRight: number,
        expectedTop: number,
        expectedBottom: number) => {
            const newRectangle = rectangle.expandToIncludeRectangle(rectangleToInclude);
            const expectedRectangle: Rectangle = new Rectangle(expectedLeft, expectedTop, expectedRight - expectedLeft, expectedBottom - expectedTop);
            expect(newRectangle.isContainedByRectangle(expectedRectangle)).toBe(true);
            expect(expectedRectangle.isContainedByRectangle(newRectangle)).toBe(true);
    });

    it("should contain another rectangle", () => {
        const other: Rectangle = new Rectangle(1.5, 1.5, 1, 1);
        expect(other.isContainedByRectangle(rectangle)).toBe(true);
    });

    it("should not contain another rectangle", () => {
        const other: Rectangle = new Rectangle(0, 0, 4, 4);
        expect(other.isContainedByRectangle(rectangle)).toBe(false);
    });

    it.each([
        new Rectangle(-3, 1, 2, 2),
        new Rectangle(4, 1, 2, 2),
        new Rectangle(1, -3, 2, 2),
        new Rectangle(1, 4, 2, 2)
    ])("should not intersect rectangle %j", (otherRectangle: Rectangle) => {
        expect(rectangle.intersectsRectangle(otherRectangle)).toBe(false);
    });

    it.each([
        new Rectangle(0, 1, 2, 2),
        new Rectangle(2, 1, 2, 2),
        new Rectangle(1, 0, 2, 2),
        new Rectangle(1, 2, 2, 2)
    ])("should intersect rectangle %j", (otherRectangle: Rectangle) => {
        expect(rectangle.intersectsRectangle(otherRectangle)).toBe(true);
    });

    describe("that is transformed", () => {
        const sqrt2 = Math.sqrt(2);
        const halfSqrt2 = sqrt2 / 2;
        let transformation: Transformation;
        let transformedRectangle: Area;

        beforeEach(() => {
            transformation = new Transformation(halfSqrt2, halfSqrt2, -halfSqrt2, halfSqrt2, 0, 0);
            transformedRectangle = rectangle.transform(transformation);
        });

        it("should result in a new rectangle", () => {
            const expectedRectangle: Rectangle = new Rectangle(-sqrt2 - 0.05, sqrt2 - 0.05, 2 * sqrt2 + 0.1, 2 * sqrt2 + 0.1);
            expect(transformedRectangle.isContainedByRectangle(expectedRectangle)).toBe(true);
        });
    });
});