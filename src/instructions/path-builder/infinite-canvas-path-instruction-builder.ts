import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { Point } from "../../geometry/point";
import { Transformation } from "../../transformation";
import { InstructionUsingInfinity } from "../instruction-using-infinity";

export class InfiniteCanvasPathInstructionBuilder{

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