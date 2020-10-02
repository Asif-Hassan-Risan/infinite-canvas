import { ConvexPolygon } from "../areas/polygons/convex-polygon";

export interface ViewboxTransformer {
    getTransformedViewbox(drawnLineWidth: number): ConvexPolygon;
}