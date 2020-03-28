import { Position } from "../../geometry/position";
import { PathInstructionBuilder } from "./path-instruction-builder";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";

export interface PathBuilder{
    getPathInstructionBuilder(state: InfiniteCanvasState): PathInstructionBuilder;
    canAddLineTo(position: Position): boolean;
    addPosition(position: Position): PathBuilder;
    isClosable(): boolean;
    containsFinitePoint(): boolean;
    readonly currentPosition: Position;
}
