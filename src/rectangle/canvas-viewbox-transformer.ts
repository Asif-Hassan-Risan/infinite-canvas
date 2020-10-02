import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Transformation } from "../transformation";
import { CanvasRectangle } from "./canvas-rectangle";
import { ViewboxTransformer } from "./viewbox-transformer";

export class CanvasViewboxTransformer implements ViewboxTransformer{
    constructor(private readonly state: InfiniteCanvasState, private readonly rectangle: CanvasRectangle){}
    public getTransformedViewbox(drawnLineWidth: number): ConvexPolygon{
        const t: Transformation = this.state.current.transformation.before(this.rectangle.transformation)
        return this.rectangle.polygon.expandByDistance(drawnLineWidth * this.rectangle.transformation.scale).transform(t.inverse());
    }
}