import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { InstructionAndState } from "../interfaces/instruction-and-state";
import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";

export class StateAndInstruction implements StateChangingInstructionSet{
    constructor(public initialState: InfiniteCanvasState, public state: InfiniteCanvasState, protected instruction: Instruction, protected stateConversion: Instruction){
    }
    public setInitialState(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToState(this.state);
        this.stateConversion = instructionToConvert;
    }
    public get stateOfFirstInstruction(): InfiniteCanvasState{
        return this.state;
    }
    public addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): void{
        this.state = this.state.withClippedPath(clippedPath);
    }
    public setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void{
        this.initialState = previousState;
        const instructionToConvert: Instruction = this.initialState.getInstructionToConvertToStateWithClippedPath(this.state);
        this.stateConversion = instructionToConvert;
    }
    public getAllInstructionsAndStates(): InstructionAndState[]{
        return [{instruction: this.instruction, state: this.state}];
    }
    public copy(): StateAndInstruction{
        return new StateAndInstruction(this.initialState, this.state, this.instruction, this.stateConversion);
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation): void{
        if(this.stateConversion){
            this.stateConversion(context, transformation);
        }
        this.instruction(context, transformation);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction): StateAndInstruction{
        return new StateAndInstruction(state, state, instruction, () => {});
    }
}
