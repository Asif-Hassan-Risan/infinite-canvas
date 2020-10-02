import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Point } from "../geometry/point";
import { ViewboxInfinityProvider } from "../interfaces/viewbox-infinity-provider";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Transformable } from "../transformable";
import { ViewboxTransformer } from "./viewbox-transformer";

export interface CanvasRectangle extends Transformable, ViewboxInfinityProvider {
    viewboxWidth: number;
    viewboxHeight: number;
    polygon: ConvexPolygon;
    measure(): void;
    getViewboxPosition(screenX: number, screenY: number): Point;
    getViewboxTransformer(state: InfiniteCanvasState): ViewboxTransformer;
}
