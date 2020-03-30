import { Transformation } from "../../transformation";
import { PathInstructionBuilder } from "./path-instruction-builder";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";

export abstract class InfiniteCanvasPathBuilder{
    protected abstract transform(transformation: Transformation): InfiniteCanvasPathBuilder;
    protected abstract getInstructionBuilder(): PathInstructionBuilder;
    public getPathInstructionBuilder(state: InfiniteCanvasState): PathInstructionBuilder{
        return this.transform(state.current.transformation.inverse()).getInstructionBuilder();
    }
}