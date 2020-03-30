import {Point} from "../../../geometry/point";
import {PathBuilder} from "../path-builder";
import {Position} from "../../../geometry/position";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import { Transformation } from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderFromPointToPoint } from "./path-instruction-builder-from-point-to-point";
import { InfiniteCanvasPathBuilder } from "../infinite-canvas-path-builder";

export class PathBuilderFromPointToPoint extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPoint: Point, public readonly currentPosition: Point) {
        super();
    }
    protected getInstructionBuilder(): PathInstructionBuilder{
        return new PathInstructionBuilderFromPointToPoint(this.initialPoint, this.currentPosition);
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
        return new PathBuilderFromPointToPoint(this.pathBuilderProvider, transformation.apply(this.initialPoint), transformation.apply(this.currentPosition));
    }
}
