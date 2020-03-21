import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { PathInstructionWithState } from "./path-instruction-with-state";
import { boxInstruction } from "./box-instruction";

export class DrawingPathInstructionWithState extends PathInstructionWithState{
    public copy(): DrawingPathInstructionWithState{
        return new DrawingPathInstructionWithState(this.initialState, this.state, this.boxedInstruction.copy(), this.stateConversion);
    }
    public static createDrawing(initialState: InfiniteCanvasState, initialInstruction: Instruction): DrawingPathInstructionWithState{
        return new DrawingPathInstructionWithState(initialState, initialState, boxInstruction(initialInstruction), () => {});
    }
}