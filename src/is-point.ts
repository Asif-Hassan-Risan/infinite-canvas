import { Point } from "./point";
import { Rectangle } from "./rectangle";
import { Area } from "./interfaces/area";

export function isPoint(pointOrRectangle: Point | Area): pointOrRectangle is Point{
    return (pointOrRectangle as Point).x !== undefined;
}