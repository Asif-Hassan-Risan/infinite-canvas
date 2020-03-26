import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { Point } from "../../geometry/point";
import { Instruction } from "../instruction";
import { Transformation } from "../../transformation";

export class InfiniteCanvasPathInstructionBuilder{
    constructor(private readonly infinity: ViewboxInfinity){}

    protected moveToInfinityFromPointInDirection(point: Point, direction: Point): Instruction{
        const infinity: ViewboxInfinity = this.infinity;
        return (context: CanvasRenderingContext2D) => {
            const {x, y} = infinity.getInfinityFromPointInDirection(point, direction);
            context.moveTo(x, y);
        };
    }

    protected lineToInfinityFromPointInDirection(point: Point, direction: Point): Instruction{
        const infinity: ViewboxInfinity = this.infinity;
        return (context: CanvasRenderingContext2D) => {
            const {x, y} = infinity.getInfinityFromPointInDirection(point, direction);
            context.lineTo(x, y);
        };
    }

    protected lineToInfinityFromInfinityFromPoint(point: Point, fromDirection: Point, toDirection: Point): Instruction{
        const infinity: ViewboxInfinity = this.infinity;
        return (context: CanvasRenderingContext2D) => {
            const infinities: Point[] = infinity.getInfinitiesFromDirectionFromPointToDirection(point, fromDirection, toDirection);
            for(let _infinity of infinities){
                let {x, y} = _infinity;
                context.lineTo(x, y)
            }
        };
    }

    protected lineTo(point: Point): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {x, y} = transformation.apply(point);
            context.lineTo(x, y);
        };
    }
    
    protected moveTo(point: Point): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {x, y} = transformation.apply(point);
            context.moveTo(x, y);
        };
    }
}