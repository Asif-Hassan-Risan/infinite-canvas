import { Point } from "../geometry/point";
import { Rectangle } from "./rectangle";

export interface AreaBuilder{
    addPoint(point: Point): void;
    addRectangle(rectangle: Rectangle): void;
}