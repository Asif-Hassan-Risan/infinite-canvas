import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithArea } from "../interfaces/state-changing-instruction-set-with-area";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Area } from "../areas/area";
import { Rectangle } from "../areas/rectangle";

export class RectangularDrawing extends StateAndInstruction implements StateChangingInstructionSetWithArea{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, combinedInstruction: Instruction, public area: Area){
        super(initialState, state, instruction, combinedInstruction);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.intersects(area) && !this.isContainedBy(area);
    }
    public intersects(area: Rectangle): boolean{
        return this.area.intersectsRectangle(area);
    }
    public isContainedBy(area: Rectangle): boolean {
        return this.area.isContainedByRectangle(area);
    }
    public static createDrawing(initialState: InfiniteCanvasState, instruction: Instruction, area: Area): RectangularDrawing{
        return new RectangularDrawing(initialState, initialState, instruction, instruction, area);
    }
}