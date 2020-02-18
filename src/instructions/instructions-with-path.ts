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
import { AreaBuilder } from "../areas/area-builder";
import { Position } from "../geometry/position";
import { transformPosition } from "../geometry/transform-position";
import { Point } from "../geometry/point";

export class InstructionsWithPath extends StateChangingInstructionSequence<PathInstructionWithState> implements StateChangingInstructionSetWithAreaAndCurrentPath{
    private areaBuilder: InfiniteCanvasAreaBuilder = new InfiniteCanvasAreaBuilder();
    private drawnArea: Area;
    private currentPosition: Position;
    private latestPathStartingPosition: Position;
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
        this.drawnArea = newlyDrawnArea;
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
    public closePath(): void{
        if(this.latestPathStartingPosition){
            this.currentPosition = this.latestPathStartingPosition;
        }
        const toAdd: PathInstructionWithState = PathInstructionWithState.create(this.state, (context: CanvasRenderingContext2D) => {context.closePath();});
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public moveTo(x: number, y: number, state: InfiniteCanvasState): void{
        const pointToMoveTo: Point = new Point(x, y);
        const transformedPointToMoveTo: Point = state.current.transformation.apply(pointToMoveTo);
        this.areaBuilder.addPoint(transformedPointToMoveTo);
        this.latestPathStartingPosition = transformedPointToMoveTo;
        this.currentPosition = transformedPointToMoveTo;
        const toAdd: PathInstructionWithState = PathInstructionWithState.create(state, (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {x, y} = transformation.apply(pointToMoveTo);
            context.moveTo(x, y);
        });
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void{
        pathInstruction.changeArea(this.areaBuilder.transformedWith(state.current.transformation));
        if(pathInstruction.positionChange){
            this.currentPosition = transformPosition(pathInstruction.positionChange, state.current.transformation);
        }
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
    public hasDrawingAcrossBorderOf(area: Area): boolean{
        if(!this.drawnArea || !this.visible){
            return false;
        }
        if(area.contains(this.drawnArea)){
            return false;
        }
        return this.drawnArea.intersects(area);
    }
    public isContainedBy(area: Area): boolean {
        const areaToContain: Area = this.drawnArea || this.area;
        return area.contains(areaToContain);
    }
    public intersects(area: Area): boolean{
        if(!this.area || !this.visible){
            return false;
        }
        return this.area.intersects(area);
    }
    public getClippedArea(previouslyClipped?: Area): Area {
        return previouslyClipped ? this.area.intersectWith(previouslyClipped): this.area;
    }

    public clearContentsInsideArea(area: Area): void{
        if(!this.drawnArea || !this.visible){
            return;
        }
        this.removeAll(i => i instanceof DrawingPathInstructionWithState && area.contains(i.drawnArea));
        if(area.contains(this.drawnArea)){
            this.visible = false;
        }
    }
    public addClearRect(area: Area, state: InfiniteCanvasState, instructionToClear: Instruction): void{
        this.addPathInstruction({
            instruction: instructionToClear,
            changeArea: (builder: AreaBuilder) => builder.addArea(area)
        }, state);
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
    public static create(initialState: InfiniteCanvasState): InstructionsWithPath{
        return new InstructionsWithPath(StateAndInstruction.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}));
    }
}
