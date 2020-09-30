import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";

export interface CanvasRectangle {
    viewboxWidth: number;
    viewboxHeight: number;
    polygon: ConvexPolygon;
    measure(): void;
    getViewboxPosition(screenX: number, screenY: number): Point;
}
