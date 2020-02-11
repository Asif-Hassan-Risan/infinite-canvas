import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { defaultState } from "../state/default-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { StateAndInstruction } from "./state-and-instruction";
import { ClearRectWithState } from "./clear-rect-with-state";
import { Drawing } from "../interfaces/drawing";
import { Rectangle } from "../areas/rectangle";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";

export class PreviousInstructions extends StateChangingInstructionSequence<StateChangingInstructionSetWithArea> implements Drawing{
    constructor(initiallyWithState: StateAndInstruction){
        super(initiallyWithState);
    }
    protected reconstructState(fromState: InfiniteCanvasState, toInstructionSet: StateChangingInstructionSetWithArea): void{
        toInstructionSet.setInitialStateWithClippedPaths(fromState);
    }
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        return this.contains(i => i.hasDrawingAcrossBorderOf(area));
    }
    public intersects(area: Area): boolean{
        return this.contains(i => i.intersects(area));
    }
    public addClearRect(area: Rectangle, state: InfiniteCanvasState, instructionToClear: Instruction): void{
        const clearRect: ClearRectWithState = ClearRectWithState.createClearRect(state, area, instructionToClear);
        clearRect.setInitialState(this.state);
        this.add(clearRect);
    }
    public clearContentsInsideArea(area: Area): void{
        this.removeAll(i => i.isContainedBy(area));
    }
    public isContainedBy(area: Rectangle): boolean {
        return !this.contains(i => !i.isContainedBy(area));
    }
    public static create(): PreviousInstructions{
        return new PreviousInstructions(StateAndInstruction.create(defaultState, InfiniteCanvasStateInstance.setDefault));
    }
}
