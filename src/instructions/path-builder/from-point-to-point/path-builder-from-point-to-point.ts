import {Point} from "../../../geometry/point";
import {PathBuilder} from "../path-builder";
import {Position} from "../../../geometry/position";
import {ViewboxInfinity} from "../../../interfaces/viewbox-infinity";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import { Transformation } from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderFromPointToPoint } from "./path-instruction-builder-from-point-to-point";
import { InfiniteCanvasPathBuilder } from "../infinite-canvas-path-builder";
import { PathInfinityProvider } from "../../../interfaces/path-infinity-provider";

export class PathBuilderFromPointToPoint extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, infinityProvider: PathInfinityProvider, private readonly initialPoint: Point, public readonly currentPosition: Point) {
        super(infinityProvider);
    }
    protected getInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointToPoint(infinity, this.initialPoint, this.currentPosition);
    }
    public canAddLineTo(position: Position): boolean{
        return true;
    }
    public containsFinitePoint(): boolean{
        return true;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointToPointAtInfinity(this.initialPoint, position);
        }
        return this.pathBuilderProvider.fromPointToPoint(this.initialPoint, position);
    }
    protected transform(transformation: Transformation): InfiniteCanvasPathBuilder{
        return new PathBuilderFromPointToPoint(this.pathBuilderProvider, this.infinityProvider, transformation.apply(this.initialPoint), transformation.apply(this.currentPosition));
    }
}
