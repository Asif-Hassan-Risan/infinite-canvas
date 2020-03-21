import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { PathInstructionWithState } from "./path-instruction-with-state";
import { boxInstruction } from "./box-instruction";

export class ClippingPathInstructionWithState extends PathInstructionWithState{
    public copy(): ClippingPathInstructionWithState{
        return new ClippingPathInstructionWithState(this.initialState, this.state, this.boxedInstruction.copy(), this.stateConversion);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): ClippingPathInstructionWithState{
        return new ClippingPathInstructionWithState(initialState, initialState, boxInstruction(initialInstruction), () => {});
    }
}