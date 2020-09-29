import { ConvexPolygon } from "../areas/polygons/convex-polygon";

export interface CanvasRectangle {
    viewboxWidth: number;
    viewboxHeight: number;
    polygon: ConvexPolygon;
    measure(): void;
}
