import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { StateChange } from "./state/state-change";
import { Instruction } from "./instructions/instruction";
import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";
import { PathInstruction } from "./interfaces/path-instruction";
import { CurrentState } from "./interfaces/current-state";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "./interfaces/state-changing-instruction-set-with-area-and-current-path";
import { PreviousInstructions } from "./instructions/previous-instructions";

export class InfiniteCanvasInstructionSet {
    private currentInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState;
    private previousInstructionsWithPath: PreviousInstructions;
    private currentlyWithState: CurrentState;
    constructor(private readonly onChange: () => void){
        this.previousInstructionsWithPath = new PreviousInstructions();
        this.currentlyWithState = this.previousInstructionsWithPath;
    }
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    public beginPath(): void{
        if(this.currentInstructionsWithPath){
            this.previousInstructionsWithPath.add(this.currentInstructionsWithPath);
        }
        this.currentInstructionsWithPath = InstructionsWithPath.create(this.state);
        this.currentlyWithState = this.currentInstructionsWithPath;
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
        this.currentlyWithState.changeState(change);
    }
    public saveState(): void{
        this.currentlyWithState.saveState();
    }
    public restoreState(): void{
        this.currentlyWithState.restoreState();
    }

    public drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        if(pathInstructions){
            this.drawPathInstructions(pathInstructions, instruction);
        }else{
            this.drawCurrentPath(instruction);
        }
        this.onChange();
    }

    private drawCurrentPath(instruction: Instruction){
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.currentInstructionsWithPath.drawPath(instruction);
    }

    private drawPathInstructions(pathInstructions: PathInstruction[], instruction: Instruction): void{
        const pathToDraw: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = InstructionsWithPath.create(this.state, pathInstructions);
        pathToDraw.drawPath(instruction);
        this.previousInstructionsWithPath.addAndMaintainState(pathToDraw);
    }

    public addPathInstruction(pathInstruction: PathInstruction): void{
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.addPathInstruction(pathInstruction);
        }
    }

    public intersects(area: Rectangle): boolean{
        return this.previousInstructionsWithPath.intersects(area) || this.currentInstructionsWithPath && this.currentInstructionsWithPath.intersects(area);
    }

    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        return this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(area) || this.currentInstructionsWithPath && this.currentInstructionsWithPath.hasDrawingAcrossBorderOf(area);
    }

    public clearContentsInsideArea(area: Rectangle): void{
        this.previousInstructionsWithPath.clearContentsInsideArea(area);
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.clearContentsInsideArea(area);
        }
    }

    public clearArea(x: number, y: number, width: number, height: number): void{
        const rectangle: Rectangle = new Rectangle(x, y, width, height).transform(this.state.current.transformation);
        if(!this.intersects(rectangle)){
            return;
        }
        this.clearContentsInsideArea(rectangle);
        if(this.currentInstructionsWithPath && this.currentInstructionsWithPath.hasDrawingAcrossBorderOf(rectangle)){
            this.currentInstructionsWithPath.addClearRect(rectangle);
        }else if(this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(rectangle)){
            this.previousInstructionsWithPath.addClearRect(rectangle);
        }
		this.onChange();
    }
    
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(this.previousInstructionsWithPath.length || this.currentInstructionsWithPath && this.currentInstructionsWithPath.visible){
            this.previousInstructionsWithPath.execute(context, transformation);
        }
        if(this.currentInstructionsWithPath){
            this.currentInstructionsWithPath.execute(context, transformation);
        }
        for(let i = 0; i < this.currentlyWithState.state.stack.length; i++){
            context.restore();
        }
    }
}