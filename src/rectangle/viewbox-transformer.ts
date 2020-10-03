import { ConvexPolygon } from "../areas/polygons/convex-polygon";

export interface ViewboxTransformer {
    getTransformedViewbox(margin: number): ConvexPolygon;
    addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void;
}