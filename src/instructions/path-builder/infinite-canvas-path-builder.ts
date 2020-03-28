import { Transformation } from "../../transformation";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { PathInstructionBuilder } from "./path-instruction-builder";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { ViewboxInfinityProvider } from "../../interfaces/viewbox-infinity-provider";

export abstract class InfiniteCanvasPathBuilder{
    constructor(protected readonly infinityProvider: ViewboxInfinityProvider){}
    protected abstract transform(transformation: Transformation): InfiniteCanvasPathBuilder;
    protected abstract getInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder;
    public getPathInstructionBuilder(state: InfiniteCanvasState): PathInstructionBuilder{
        const infinity: ViewboxInfinity = this.infinityProvider.getInfinity(state);
        return this.transform(state.current.transformation.inverse()).getInstructionBuilder(infinity);
    }
}