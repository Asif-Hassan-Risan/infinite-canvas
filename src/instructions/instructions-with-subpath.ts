import {StateChangingInstructionSequence} from "./state-changing-instruction-sequence";
import {PathInstructionWithState} from "./path-instruction-with-state";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Position} from "../geometry/position";
import {isPointAtInfinity} from "../geometry/is-point-at-infinity";
import {transformPosition} from "../geometry/transform-position";
import {PathInstruction} from "../interfaces/path-instruction";
import {positionsAreEqual} from "../geometry/positions-are-equal";
import { Instruction } from "./instruction";
import { PathBuilder } from "./path-builder/path-builder";
import { InfiniteCanvasPathBuilderProvider } from "./path-builder/infinite-canvas-path-builder-provider";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { StateAndInstruction } from "./state-and-instruction";

export class InstructionsWithSubpath extends StateChangingInstructionSequence<StateAndInstruction>{
    constructor(private _initiallyWithState: PathInstructionWithState, private pathBuilder: PathBuilder) {
        super(_initiallyWithState);
    }
    public addDrawingInstruction(drawingInstruction: StateAndInstruction): void{
        drawingInstruction.setInitialState(this.state);
        this.add(drawingInstruction);
    }
    public addClippingInstruction(clippingInstruction: StateAndInstruction): void{
        clippingInstruction.setInitialState(this.state);
        this.add(clippingInstruction);
    }
    public closePath(): void{
        const toAdd: StateAndInstruction = StateAndInstruction.create(this.state, (context: CanvasRenderingContext2D) => {context.closePath();});
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public copy(): InstructionsWithSubpath{
        const result: InstructionsWithSubpath = new InstructionsWithSubpath(this._initiallyWithState.copy(), this.pathBuilder);
        for(const added of this.added){
            result.add(added.copy());
        }
        return result;
    }
    public containsFinitePoint(): boolean{
        return this.pathBuilder.containsFinitePoint();
    }
    public isClosable(): boolean{
        return this.pathBuilder.isClosable();
    }
    public canAddLineTo(position: Position): boolean{
        return this.pathBuilder.canAddLineTo(position);
    }
    public lineTo(position: Position, state: InfiniteCanvasState): void{
        const transformedPosition: Position = transformPosition(position, state.current.transformation);
        if(!isPointAtInfinity(position) || this.pathBuilder.containsFinitePoint()){
            this.addInstructionToDrawLineTo(position, state);
        }
        this.pathBuilder = this.pathBuilder.addPosition(transformedPosition);
        this._initiallyWithState.replaceInstruction(this.pathBuilder.getPathInstructionBuilder(this._initiallyWithState.state).getMoveTo());
    }
    private addInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): void{
        const instructionToDrawLine: Instruction = this.pathBuilder.getPathInstructionBuilder(state).getLineTo(position);
        let toAdd: PathInstructionWithState = PathInstructionWithState.create(state, instructionToDrawLine);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public addPathInstruction(pathInstruction: PathInstruction, pathInstructionWithState: StateAndInstruction, state: InfiniteCanvasState): void{
        if(pathInstruction.initialPoint && !positionsAreEqual(this.pathBuilder.currentPosition, pathInstruction.initialPoint)){
            this.lineTo(pathInstruction.initialPoint, state);
        }
        if(pathInstruction.positionChange){
            this.pathBuilder = this.pathBuilder.addPosition(transformPosition(pathInstruction.positionChange, state.current.transformation));
        }
        pathInstructionWithState.setInitialState(this.state);
        this.add(pathInstructionWithState);
    }
    public static create(initialState: InfiniteCanvasState, initialPosition: Position, infinityProvider: PathInfinityProvider): InstructionsWithSubpath{
        const transformedInitialPosition: Position = transformPosition(initialPosition, initialState.current.transformation);
        const pathBuilder: PathBuilder = new InfiniteCanvasPathBuilderProvider(infinityProvider).getBuilderFromPosition(transformedInitialPosition);
        let initialInstruction: PathInstructionWithState = PathInstructionWithState.create(initialState, pathBuilder.getPathInstructionBuilder(initialState).getMoveTo());        
        return new InstructionsWithSubpath(initialInstruction, pathBuilder);
    }
}
