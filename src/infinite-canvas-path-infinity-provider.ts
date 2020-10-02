import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { InfiniteCanvasViewboxInfinity } from "./infinite-canvas-viewbox-infinity";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";

export class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider{
    constructor(private readonly canvasRectangle: CanvasRectangle){}
    private drawnLineWidth: number = 0;
    private lineDashPeriod: number = 0;
    public getPathInstructionToGoAroundViewbox(): Instruction{
        const lw: number = this.drawnLineWidth;
        const width: number = this.canvasRectangle.viewboxWidth + 2 * lw;
        const height: number = this.canvasRectangle.viewboxHeight + 2 * lw;
        return (context: CanvasRenderingContext2D) => {
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.rect(-lw, -lw, width, height);
            context.restore();
        };
    }
    public addDrawnLineWidth(lineWidth: number): void{
        this.drawnLineWidth = lineWidth;
    }
    public addLineDashPeriod(lineDashPeriod: number): void {
        this.lineDashPeriod = lineDashPeriod;
    }

    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity{
        return new InfiniteCanvasViewboxInfinity(this.canvasRectangle.getViewboxTransformer(state), () => this.lineDashPeriod, () => this.drawnLineWidth);
    }
}
