import { Transformation } from "../../transformation";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { PathInstructionBuilder } from "./path-instruction-builder";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { PathInfinityProvider } from "../../interfaces/path-infinity-provider";

export abstract class InfiniteCanvasPathBuilder{
    constructor(protected readonly infinityProvider: PathInfinityProvider){}
    protected abstract transform(transformation: Transformation): InfiniteCanvasPathBuilder;
    protected abstract getInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder;
    public getPathInstructionBuilder(state: InfiniteCanvasState): PathInstructionBuilder{
        const infinity: ViewboxInfinity = this.infinityProvider.getInfinity(state);
        return this.transform(state.current.transformation.inverse()).getInstructionBuilder(infinity);
    }
}