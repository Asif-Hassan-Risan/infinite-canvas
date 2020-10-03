import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Instruction } from "../instructions/instruction";
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
    public transformRelatively(instruction: Instruction): Instruction{
        return (context: CanvasRenderingContext2D) => {
            const {a, b, c, d, e, f} = this.rectangle.transformation;
            context.save();
            context.transform(a, b, c, d, e, f);
            instruction(context, this.rectangle.transformation);
            context.restore();
        };
    }
    public transformAbsolutely(instruction: Instruction): Instruction{
        return (context: CanvasRenderingContext2D) => {
            const {a, b, c, d, e, f} = this.rectangle.transformation;
            context.save();
            context.setTransform(a, b, c, d, e, f);
            instruction(context, this.rectangle.transformation);
            context.restore();
        };
    }
}