import { StateAndInstruction } from "./state-and-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";

export class PathInstructionWithState extends StateAndInstruction{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction){
        super(initialState, state, instruction, stateConversion);
    }
    public replaceInstruction(instruction: Instruction): void{
        this.instruction = instruction;
    }
    public copy(): PathInstructionWithState{
        return new PathInstructionWithState(this.initialState, this.state, this.instruction, this.stateConversion);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): PathInstructionWithState{
        return new PathInstructionWithState(initialState, initialState, initialInstruction, () => {});
    }
}