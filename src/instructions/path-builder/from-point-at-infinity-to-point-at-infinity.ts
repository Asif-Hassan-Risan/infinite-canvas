import {PointAtInfinity} from "../../geometry/point-at-infinity";
import {Point} from "../../geometry/point";
import {InfiniteCanvasPathBuilder} from "./infinite-canvas-path-builder";
import {PathBuilder} from "./path-builder";
import {Position} from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Instruction} from "../instruction";
import {isPointAtInfinity} from "../../geometry/is-point-at-infinity";
import {Transformation} from "../../transformation";
import { PathBuilderProvider } from "./path-builder-provider";

export class FromPointAtInfinityToPointAtInfinity extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, private readonly firstFinitePoint: Point, public currentPosition: PointAtInfinity) {
        super();
    }
    public getLineTo(position: Position, infinity: ViewboxInfinity): Instruction{
        if(isPointAtInfinity(position)){
            return undefined;
        }
        return this.lineTo(position);
    }
    public getMoveTo(infinity: ViewboxInfinity): Instruction{
        return undefined;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(this.initialPosition, this.firstFinitePoint, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, this.firstFinitePoint || position, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new FromPointAtInfinityToPointAtInfinity(
            this.pathBuilderProvider,
            transformation.applyToPointAtInfinity(this.initialPosition),
            this.firstFinitePoint ? transformation.apply(this.firstFinitePoint) : undefined,
            transformation.applyToPointAtInfinity(this.currentPosition));
    }
}
