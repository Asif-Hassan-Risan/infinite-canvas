import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { PathInstructionWithState } from "./path-instruction-with-state";
import { Area } from "../areas/area";

export class DrawingPathInstructionWithState extends PathInstructionWithState{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, combinedInstruction: Instruction, public drawnArea: Area){
        super(initialState, state, instruction, combinedInstruction);
    }
    public copy(): DrawingPathInstructionWithState{
        return new DrawingPathInstructionWithState(this.initialState, this.state, this.instruction, this.combinedInstruction, this.drawnArea);
    }
    public static createDrawing(initialState: InfiniteCanvasState, initialInstruction: Instruction, drawnArea: Area): DrawingPathInstructionWithState{
        return new DrawingPathInstructionWithState(initialState, initialState, initialInstruction, initialInstruction, drawnArea);
    }
}