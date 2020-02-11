import { Point } from "../geometry/point";
import { Area } from "./area";

export interface AreaBuilder{
    addPoint(point: Point): void;
    addArea(area: Area): void;
}