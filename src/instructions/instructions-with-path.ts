import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { PathInstructionWithState } from "./path-instruction-with-state";
import { StateAndInstruction } from "./state-and-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { PathInstruction } from "../interfaces/path-instruction";
import { Transformation } from "../transformation";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { ClippingPathInstructionWithState } from "./clipping-path-instruction-with-state";
import { DrawingPathInstructionWithState } from "./drawing-path-instruction-with-state";
import { Area } from "../areas/area";
import { InfiniteCanvasAreaBuilder } from "../areas/infinite-canvas-area-builder";
import { Rectangle } from "../areas/rectangle";
import { AreaBuilder } from "../areas/area-builder";

export class InstructionsWithPath extends StateChangingInstructionSequence<PathInstructionWithState> implements StateChangingInstructionSetWithAreaAndCurrentPath{
    private areaBuilder: InfiniteCanvasAreaBuilder = new InfiniteCanvasAreaBuilder();
    private drawnArea: Area;
    public visible: boolean;
    constructor(private _initiallyWithState: StateAndInstruction){
        super(_initiallyWithState);
    }
    private get area(): Area{return this.areaBuilder.area;}
    private getCurrentlyDrawableArea(): Area{
        if(!this.area){
            return undefined;
        }
        if(!this.state.current.clippingRegion){
            return this.area;
        }
        return this.state.current.clippingRegion.intersectWith(this.area);
    }
    private copy(): InstructionsWithPath{
        const result: InstructionsWithPath = new InstructionsWithPath(this._initiallyWithState.copy());
        for(const added of this.added){
            result.add(added.copy());
        }
        return result;
    }
    public drawPath(instruction: Instruction, state: InfiniteCanvasState): void{
        const newlyDrawnArea: Area = this.getCurrentlyDrawableArea();
        this.drawnArea = newlyDrawnArea;//!this.drawnArea || newlyDrawnArea.contains(this.drawnArea) ? newlyDrawnArea : this.drawnArea;
        const toAdd: DrawingPathInstructionWithState = DrawingPathInstructionWithState.createDrawing(state, instruction, this.drawnArea);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
        this.visible = true;
    }
    public clipPath(instruction: Instruction, state: InfiniteCanvasState): void{
        const toAdd: ClippingPathInstructionWithState = ClippingPathInstructionWithState.create(state, instruction);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
        const clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath = this.recreateClippedPath();
        this.addClippedPath(clippedPath);
    }
    public addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void{
        //this.area = pathInstruction.changeArea.execute(state.current.transformation, this.area);
        pathInstruction.changeArea(this.areaBuilder.transformedWith(state.current.transformation));
        const toAdd: PathInstructionWithState = PathInstructionWithState.create(state, pathInstruction.instruction);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        if(!this.visible){
            return;
        }
        super.execute(context, transformation);
    }
    public hasDrawingAcrossBorderOf(area: Rectangle): boolean{
        if(!this.drawnArea || !this.visible){
            return false;
        }
        if(this.drawnArea.isContainedByRectangle(area)){
            return false;
        }
        return this.drawnArea.intersectsRectangle(area);
    }
    public isContainedBy(area: Rectangle): boolean {
        const areaToContain: Area = this.drawnArea || this.area;
        return areaToContain.isContainedByRectangle(area);
    }
    public intersects(area: Rectangle): boolean{
        if(!this.area || !this.visible){
            return false;
        }
        return this.area.intersectsRectangle(area);
    }
    public getClippedArea(previouslyClipped?: Area): Area {
        return previouslyClipped ? this.area.intersectWith(previouslyClipped): this.area;
    }

    public clearContentsInsideArea(area: Rectangle): void{
        if(!this.drawnArea || !this.visible){
            return;
        }
        this.removeAll(i => i instanceof DrawingPathInstructionWithState && i.drawnArea.isContainedByRectangle(area));
        if(this.drawnArea.isContainedByRectangle(area)){
            this.visible = false;
        }
    }
    public addClearRect(area: Rectangle, state: InfiniteCanvasState): void{
        this.addPathInstruction(area.getInstructionToClear(), state);
    }
    public recreatePath(): StateChangingInstructionSetWithAreaAndCurrentPath{
        const result: InstructionsWithPath = this.copy();
        result.removeAll(i => (i instanceof DrawingPathInstructionWithState));
        result.areaBuilder = this.areaBuilder.copy();
        return result;
    }
    private recreateClippedPath(): StateChangingInstructionSetWithAreaAndCurrentPath{
        const result: InstructionsWithPath = this.copy();
        result.removeAll(i => i instanceof DrawingPathInstructionWithState);
        result.areaBuilder = this.areaBuilder.copy();
        return result;
    }
    public static createRectangularPath(initialState: InfiniteCanvasState, rectangle: Rectangle, instruction: Instruction): InstructionsWithPath{
        const result: InstructionsWithPath = new InstructionsWithPath(StateAndInstruction.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}));
        result.addPathInstruction({
            instruction: instruction,
            changeArea: (builder: AreaBuilder) => builder.addRectangle(rectangle)
        }, initialState);
        return result;
    }
    public static create(initialState: InfiniteCanvasState): InstructionsWithPath{
        return new InstructionsWithPath(StateAndInstruction.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}));
    }
}
