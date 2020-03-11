import {Point} from "../geometry/point";

export interface ViewboxInfinity{
    getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point;
    getInfinitiesFromDirectionFromPointToDirection(point: Point, direction1: Point, direction2: Point): Point[];
}