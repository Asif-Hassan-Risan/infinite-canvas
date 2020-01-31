import { Point } from "../point";
import { Rectangle } from "./rectangle";

export interface AreaBuilder{
    addPoint(point: Point): void;
    addRectangle(rectangle: Rectangle): void;
}