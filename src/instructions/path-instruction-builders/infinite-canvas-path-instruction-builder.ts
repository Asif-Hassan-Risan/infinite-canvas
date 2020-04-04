import { Transformation } from "../../transformation";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { PathShape } from "./path-shape";
import { Position } from "../../geometry/position";
import { InstructionUsingInfinity } from "../instruction-using-infinity";
import { Point } from "../../geometry/point";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";

export abstract class InfiniteCanvasPathInstructionBuilder<TPathShape extends PathShape<TPathShape>>{
    constructor(protected readonly shape: TPathShape){}
    protected abstract getInstructionToExtendShapeWithLineTo(shape: TPathShape, position: Position): InstructionUsingInfinity;
    protected abstract getInstructionToMoveToBeginningOfShape(shape: TPathShape): InstructionUsingInfinity;
    public getInstructionToDrawLineTo(position: Position, state: InfiniteCanvasState): InstructionUsingInfinity{
        return this.getInstructionToExtendShapeWithLineTo(this.shape.transform(state.current.transformation.inverse()), position);
    }
    public getInstructionToMoveToBeginning(state: InfiniteCanvasState): InstructionUsingInfinity{
        return this.getInstructionToMoveToBeginningOfShape(this.shape.transform(state.current.transformation.inverse()));
    }
    public get currentPosition(): Position{return this.shape.currentPosition;}

    protected moveToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => {
            const {x, y} = infinity.getInfinityFromPointInDirection(point, direction);
            context.moveTo(x, y);
        };
    }

    protected lineToInfinityFromPointInDirection(point: Point, direction: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => {
            const {x, y} = infinity.getInfinityFromPointInDirection(point, direction);
            context.lineTo(x, y);
        };
    }

    protected lineToInfinityFromInfinityFromPoint(point: Point, fromDirection: Point, toDirection: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => {
            const infinities: Point[] = infinity.getInfinitiesFromDirectionFromPointToDirection(point, fromDirection, toDirection);
            for(let _infinity of infinities){
                let {x, y} = _infinity;
                context.lineTo(x, y)
            }
        };
    }

    protected lineTo(point: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {x, y} = transformation.apply(point);
            context.lineTo(x, y);
        };
    }
    
    protected moveTo(point: Point): InstructionUsingInfinity{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {x, y} = transformation.apply(point);
            context.moveTo(x, y);
        };
    }
}