import {StateChangingInstructionSequence} from "./state-changing-instruction-sequence";
import {PathInstructionWithState} from "./path-instruction-with-state";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Position} from "../geometry/position";
import {Transformation} from "../transformation";
import {isPointAtInfinity} from "../geometry/is-point-at-infinity";
import {DrawingPathInstructionWithState} from "./drawing-path-instruction-with-state";
import {ClippingPathInstructionWithState} from "./clipping-path-instruction-with-state";
import {transformPosition} from "../geometry/transform-position";
import {PathInstruction} from "../interfaces/path-instruction";
import {positionsAreEqual} from "../geometry/positions-are-equal";
import { ViewboxInfinityProvider } from "../interfaces/viewbox-infinity-provider";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { Instruction } from "./instruction";
import { PathBuilder } from "./path-builder/path-builder";
import { infiniteCanvasPathBuilderProvider } from "./path-builder/infinite-canvas-path-builder-provider";

export class InstructionsWithSubpath extends StateChangingInstructionSequence<PathInstructionWithState>{
    constructor(private _initiallyWithState: PathInstructionWithState, private readonly infinityProvider: ViewboxInfinityProvider, private pathBuilder: PathBuilder) {
        super(_initiallyWithState);
    }
    public addDrawingInstruction(drawingInstruction: DrawingPathInstructionWithState): void{
        drawingInstruction.setInitialState(this.state);
        this.add(drawingInstruction);
    }
    public addClippingInstruction(clippingInstruction: ClippingPathInstructionWithState): void{
        clippingInstruction.setInitialState(this.state);
        this.add(clippingInstruction);
    }
    public closePath(): void{
        const toAdd: PathInstructionWithState = PathInstructionWithState.create(this.state, (context: CanvasRenderingContext2D) => {context.closePath();});
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public copy(): InstructionsWithSubpath{
        const result: InstructionsWithSubpath = new InstructionsWithSubpath(this._initiallyWithState.copy(), this.infinityProvider, this.pathBuilder);
        for(const added of this.added){
            result.add(added.copy());
        }
        result.removeAll(i => (i instanceof DrawingPathInstructionWithState));
        return result;
    }
    public lineTo(position: Position, state: InfiniteCanvasState): void{
        const transformedPosition: Position = transformPosition(position, state.current.transformation);
        const infinity: ViewboxInfinity = this.infinityProvider.getInfinity(state);
        const instructionToDrawLine: Instruction = this.pathBuilder.transform(state.current.transformation.inverse()).getLineTo(position, infinity);
        this.pathBuilder = this.pathBuilder.addPosition(transformedPosition);
        const initialInfinity: ViewboxInfinity = this.infinityProvider.getInfinity(this._initiallyWithState.state);
        this._initiallyWithState.replaceInstruction(this.pathBuilder.transform(this._initiallyWithState.state.current.transformation.inverse()).getMoveTo(initialInfinity));
        let toAdd: PathInstructionWithState = PathInstructionWithState.create(state, instructionToDrawLine);
        toAdd.setInitialState(this.state);
        this.add(toAdd);
    }
    public addPathInstruction(pathInstruction: PathInstruction, pathInstructionWithState: PathInstructionWithState, state: InfiniteCanvasState): void{
        if(pathInstruction.initialPoint && !positionsAreEqual(this.pathBuilder.currentPosition, pathInstruction.initialPoint)){
            this.lineTo(pathInstruction.initialPoint, state);
        }
        if(pathInstruction.positionChange){
            this.pathBuilder = this.pathBuilder.addPosition(transformPosition(pathInstruction.positionChange, state.current.transformation));
        }
        pathInstructionWithState.setInitialState(this.state);
        this.add(pathInstructionWithState);
    }
    public static createSilent(initialState: InfiniteCanvasState, initialPosition: Position, infinityProvider: ViewboxInfinityProvider): InstructionsWithSubpath{
        let initialInstruction: PathInstructionWithState = PathInstructionWithState.create(initialState, () => {});
        initialPosition = transformPosition(initialPosition, initialState.current.transformation);
        const pathBuilder: PathBuilder = infiniteCanvasPathBuilderProvider.getBuilderFromPosition(initialPosition);
        return new InstructionsWithSubpath(initialInstruction, infinityProvider, pathBuilder);
    }
    public static create(initialState: InfiniteCanvasState, initialPosition: Position, infinityProvider: ViewboxInfinityProvider): InstructionsWithSubpath{
        let initialInstruction: PathInstructionWithState;
        if(isPointAtInfinity(initialPosition)){
            initialInstruction = PathInstructionWithState.create(initialState, () => {});
        }else{
            initialInstruction = PathInstructionWithState.create(initialState, (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {x, y} = transformation.apply(initialPosition);
                context.moveTo(x, y);
            });
        }
        const transformedInitialPosition: Position = transformPosition(initialPosition, initialState.current.transformation);
        const pathBuilder: PathBuilder = infiniteCanvasPathBuilderProvider.getBuilderFromPosition(transformedInitialPosition);
        return new InstructionsWithSubpath(initialInstruction, infinityProvider, pathBuilder);
    }
}
