import { Point } from "../geometry/point";
import { Transformation } from "../transformation";

export interface ViewboxInfinity{
    getInfinityFromPointInDirection(fromPoint: Point, direction: Point, viewBoxTransformation: Transformation): Point;
}