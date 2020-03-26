import {Point} from "../../../geometry/point";
import {PathBuilder} from "../path-builder";
import {Position} from "../../../geometry/position";
import {ViewboxInfinity} from "../../../interfaces/viewbox-infinity";
import {isPointAtInfinity} from "../../../geometry/is-point-at-infinity";
import { Transformation } from "../../../transformation";
import { PathBuilderProvider } from "../path-builder-provider";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderFromPointToPoint } from "./path-instruction-builder-from-point-to-point";

export class PathBuilderFromPointToPoint implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPoint: Point, public readonly currentPosition: Point) {
    }
    public getPathInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder{
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
    public transform(transformation: Transformation): PathBuilder{
        return new PathBuilderFromPointToPoint(this.pathBuilderProvider, transformation.apply(this.initialPoint), transformation.apply(this.currentPosition));
    }
}
