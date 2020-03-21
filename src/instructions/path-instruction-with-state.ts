import { StateAndInstruction } from "./state-and-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { BoxedInstruction } from "./boxed-instruction";
import { boxInstruction } from "./box-instruction";

export class PathInstructionWithState extends StateAndInstruction{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, protected boxedInstruction: BoxedInstruction, stateConversion: Instruction){
        super(initialState, state, boxedInstruction, stateConversion);
    }
    public replaceInstruction(instruction: Instruction): void{
        this.boxedInstruction.replaceInnerInstructionWith(instruction);
    }
    public copy(): PathInstructionWithState{
        return new PathInstructionWithState(this.initialState, this.state, this.boxedInstruction.copy(), this.stateConversion);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): PathInstructionWithState{
        return new PathInstructionWithState(initialState, initialState, boxInstruction(initialInstruction), () => {});
    }
}