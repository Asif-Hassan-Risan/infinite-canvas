import { ViewboxInfinity } from "../src/interfaces/viewbox-infinity";
import { Point } from "../src/geometry/point";

export class FakeViewboxInfinity implements ViewboxInfinity{
    getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point {
        throw new Error("Method not implemented.");
    }
    getInfinitiesFromDirectionFromPointToDirection(point: Point, direction1: Point, direction2: Point): Point[] {
        throw new Error("Method not implemented.");
    }

}