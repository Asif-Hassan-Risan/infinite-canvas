import { InstructionsWithPath } from "./instructions/instructions-with-path";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { StateChange } from "./state/state-change";
import { Instruction } from "./instructions/instruction";
import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";
import { PathInstruction } from "./interfaces/path-instruction";
import { CurrentState } from "./interfaces/current-state";
import { StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState } from "./interfaces/state-changing-instruction-set-with-area-and-current-path";
import { PreviousInstructions } from "./instructions/previous-instructions";
import {StateChangingInstructionSetWithCurrentStateAndArea} from "./interfaces/state-changing-instruction-set-with-current-state-and-area";
import {InfiniteCanvasStateInstance} from "./state/infinite-canvas-state-instance";
import { RectangularDrawing } from "./instructions/rectangular-drawing";
import { TransformationKind } from "./transformation-kind";
import { InstructionBuilder } from "./instruction-builders/instruction-builder";

export class InfiniteCanvasInstructionSet {
    private currentInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState;
    private previousInstructionsWithPath: PreviousInstructions;
    private currentlyWithState: CurrentState;
    private instructionToRestoreState: Instruction;
    constructor(private readonly onChange: () => void){
        this.previousInstructionsWithPath = PreviousInstructions.create();
        this.currentlyWithState = this.previousInstructionsWithPath;
    }
    public get state(): InfiniteCanvasState{return this.currentlyWithState.state;}
    public beginPath(): void{
        this.replaceCurrentInstructionsWithPath(InstructionsWithPath.create(this.state));
    }
    public changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
        this.currentlyWithState.changeState(change);
        this.setInstructionToRestoreState();
    }
    public saveState(): void{
        this.currentlyWithState.saveState();
        this.setInstructionToRestoreState();
    }
    public restoreState(): void{
        this.currentlyWithState.restoreState();
        this.setInstructionToRestoreState();
    }

    private drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
        if(pathInstructions){
            this.drawPathInstructions(pathInstructions, instruction);
        }else{
            this.drawCurrentPath(instruction);
        }
        this.onChange();
    }
    public fillPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
		instruction = this.state.current.applyToFillingInstruction(instruction, true);
		this.drawPath(instruction, pathInstructions);
	}
	public strokePath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
		instruction = this.state.current.applyToStrokingInstruction(instruction, true);
		this.drawPath(instruction, pathInstructions);
	}
    public addDrawing(instruction: Instruction, area: Rectangle, transformationKind: TransformationKind): void{
        if(transformationKind === TransformationKind.Relative){
			const builder: InstructionBuilder = new InstructionBuilder(instruction);
			builder.transformRelative();
			instruction = builder.build();
			area = area.transform(this.state.current.transformation);
		}else if(transformationKind === TransformationKind.Absolute){
			const builder: InstructionBuilder = new InstructionBuilder(instruction);
			builder.transformAbsolute();
			instruction = builder.build();
		}
        const drawing: RectangularDrawing = RectangularDrawing.create(this.state, instruction, area);
        this.drawBeforeCurrentPath(drawing);
        this.onChange();
    }
    public addFillingDrawing(instruction: Instruction, area: Rectangle, transformationKind: TransformationKind): void{
		instruction = this.state.current.applyToFillingInstruction(instruction, false);
		this.addDrawing(instruction, area, transformationKind);
	}
	public addStrokingDrawing(instruction: Instruction, area: Rectangle, transformationKind: TransformationKind): void{
		instruction = this.state.current.applyToStrokingInstruction(instruction, false);
		this.addDrawing(instruction, area, transformationKind);
	}
    public clipPath(instruction: Instruction): void{
        this.clipCurrentPath(instruction);
    }

    private replaceCurrentInstructionsWithPath(newInstructionsWithPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState, ...instructionsToInterject: StateChangingInstructionSetWithCurrentStateAndArea[]): void{
        if(this.currentInstructionsWithPath){
            if(this.currentInstructionsWithPath.visible){
                this.previousInstructionsWithPath.add(this.currentInstructionsWithPath);
            }else{
                this.previousInstructionsWithPath.changeToStateWithClippedPaths(this.currentInstructionsWithPath.state);
            }
        }
        for(const instructionToInterject of instructionsToInterject){
            this.previousInstructionsWithPath.add(instructionToInterject);
        }
        this.currentInstructionsWithPath = newInstructionsWithPath;
        this.currentlyWithState = this.currentInstructionsWithPath;
        this.setInstructionToRestoreState();
    }

    private drawCurrentPath(instruction: Instruction): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.currentInstructionsWithPath.drawPath(instruction);
        this.setInstructionToRestoreState();
    }

    private clipCurrentPath(instruction: Instruction): void{
        if(!this.currentInstructionsWithPath){
            return;
        }
        this.currentInstructionsWithPath.clipPath(instruction);
    }

    private setInstructionToRestoreState(): void{
        const latestVisibleState: InfiniteCanvasState = this.currentInstructionsWithPath && this.currentInstructionsWithPath.visible ? this.currentInstructionsWithPath.state : this.previousInstructionsWithPath.state;
        this.instructionToRestoreState = latestVisibleState.convertToState(latestVisibleState.lastBeforeFirstSaved()).instruction;
    }

    private drawPathInstructions(pathInstructions: PathInstruction[], instruction: Instruction): void{
        const pathToDraw: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = InstructionsWithPath.create(this.state, pathInstructions);
        pathToDraw.drawPath(instruction);
        this.drawBeforeCurrentPath(pathToDraw);
    }

    private drawBeforeCurrentPath(instruction: StateChangingInstructionSetWithCurrentStateAndArea): void{
        if(this.currentInstructionsWithPath){
            const recreatedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState = this.currentInstructionsWithPath.recreatePath();
            recreatedPath.setInitialState(this.state);
            this.replaceCurrentInstructionsWithPath(recreatedPath, instruction);
        }else{
            this.previousInstructionsWithPath.add(instruction);
        }
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
        if(this.instructionToRestoreState){
            this.instructionToRestoreState(context, transformation);
        }
    }
}
