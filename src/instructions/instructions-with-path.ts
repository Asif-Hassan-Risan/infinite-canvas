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
import { isPointAtInfinity } from "../geometry/is-point-at-infinity";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import {InstructionsWithSubpath} from "./instructions-with-subpath";
import {down, left, right, up} from "../geometry/points-at-infinity";

export class InstructionsWithPath extends StateChangingInstructionSequence<InstructionsWithSubpath> implements StateChangingInstructionSetWithAreaAndCurrentPath{
    private areaBuilder: InfiniteCanvasAreaBuilder = new InfiniteCanvasAreaBuilder();
    private drawnArea: Area;
    public visible: boolean;
    constructor(private _initiallyWithState: StateAndInstruction, private readonly infinityFactory: (state: InfiniteCanvasState) => ViewboxInfinity){
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
        const result: InstructionsWithPath = new InstructionsWithPath(this._initiallyWithState.copy(), this.infinityFactory);
        for(const added of this.added){
            result.add(added.copy());
        }
        return result;
    }
    public drawPath(instruction: Instruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const newlyDrawnArea: Area = this.getCurrentlyDrawableArea();
        this.drawnArea = newlyDrawnArea;
        const toAdd: DrawingPathInstructionWithState = DrawingPathInstructionWithState.createDrawing(state, instruction, this.drawnArea);
        currentSubpath.addDrawingInstruction(toAdd);
        this.visible = true;
    }
    public clipPath(instruction: Instruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const toAdd: ClippingPathInstructionWithState = ClippingPathInstructionWithState.create(state, instruction);
        currentSubpath.addClippingInstruction(toAdd);
        const clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath = this.recreatePath();
        this.addClippedPath(clippedPath);
    }
    public closePath(): void{
        if(this.added.length === 0){
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        currentSubpath.closePath();
    }
    private silentlyMoveTo(position: Position, state: InfiniteCanvasState): void{
        const transformedPointToMoveTo: Position = transformPosition(position, state.current.transformation);
        this.areaBuilder.addPosition(transformedPointToMoveTo);
        const newSubpath: InstructionsWithSubpath = InstructionsWithSubpath.createSilent(state, position, this.infinityFactory);
        newSubpath.setInitialState(this.state);
        this.add(newSubpath);
    }
    public moveTo(position: Position, state: InfiniteCanvasState): void{
        if(isPointAtInfinity(position)){
            return;
        }
        const transformedPointToMoveTo: Point = state.current.transformation.apply(position);
        this.areaBuilder.addPoint(transformedPointToMoveTo);
        const newSubpath: InstructionsWithSubpath = InstructionsWithSubpath.create(state, position, this.infinityFactory);
        newSubpath.setInitialState(this.state);
        this.add(newSubpath);
    }
    public lineTo(position: Position, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            this.moveTo(position, state);
            return;
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const transformedPosition: Position = transformPosition(position, state.current.transformation);
        this.areaBuilder.addPosition(transformedPosition);
        currentSubpath.lineTo(position, state);
    }
    public rect(x: number, y: number, w: number, h: number, state: InfiniteCanvasState): void{
        if(Number.isFinite(x)){
            if(Number.isFinite(y)){
                this.moveTo(new Point(x, y), state);
                if(Number.isFinite(w)){
                    this.lineTo(new Point(x + w, y), state);
                    if(Number.isFinite(h)){
                        this.lineTo(new Point(x + w, y + h), state);
                        this.lineTo(new Point(x, y + h), state);
                    }else{
                        this.lineTo(h > 0 ? down : up, state);
                    }
                }else{
                    this.lineTo(w > 0 ? right : left, state);
                    if(Number.isFinite(h)){
                        this.lineTo(new Point(x, y + h), state);
                    }else{
                        this.lineTo(h > 0 ? down : up, state);
                    }
                }
                this.lineTo(new Point(x, y), state);
            }else{

            }
        }else{

        }
    }
    public addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void{
        if(this.added.length === 0){
            if(pathInstruction.initialPoint){
                this.silentlyMoveTo(pathInstruction.initialPoint, state);
            }else{
                return;
            }
        }
        const currentSubpath: InstructionsWithSubpath = this.added[this.added.length - 1];
        const toAdd: PathInstructionWithState = PathInstructionWithState.create(state, pathInstruction.instruction);
        pathInstruction.changeArea(this.areaBuilder.transformedWith(state.current.transformation));
        currentSubpath.addPathInstruction(pathInstruction, toAdd, state);
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
        for(const subpath of this.added){
            subpath.clearContentsInsideArea(area);
        }
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

        result.areaBuilder = this.areaBuilder.copy();
        return result;
    }
    public static create(initialState: InfiniteCanvasState, infinityFactory: (state: InfiniteCanvasState) => ViewboxInfinity): InstructionsWithPath{
        return new InstructionsWithPath(StateAndInstruction.create(initialState, (context: CanvasRenderingContext2D) => {context.beginPath();}), infinityFactory);
    }
}
