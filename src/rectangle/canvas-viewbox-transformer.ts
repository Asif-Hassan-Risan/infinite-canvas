import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Transformation } from "../transformation";
import { CanvasRectangle } from "./canvas-rectangle";
import { ViewboxTransformer } from "./viewbox-transformer";

export class CanvasViewboxTransformer implements ViewboxTransformer{
    constructor(private readonly state: InfiniteCanvasState, private readonly rectangle: CanvasRectangle){}
    public getTransformedViewbox(margin: number): ConvexPolygon{
        const t: Transformation = this.state.current.transformation.before(this.rectangle.transformation)
        return this.rectangle.polygon.expandByDistance(margin * this.rectangle.transformation.scale).transform(t.inverse());
    }
    public addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void{
        const width: number = this.rectangle.viewboxWidth + 2 * margin;
        const height: number = this.rectangle.viewboxHeight + 2 * margin;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.rect(-margin, -margin, width, height);
        context.restore();
    }
}