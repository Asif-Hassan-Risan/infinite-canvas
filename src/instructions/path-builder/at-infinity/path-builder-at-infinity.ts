import { PathBuilder } from "../path-builder";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { PathBuilderProvider } from "../path-builder-provider";
import { Transformation } from "../../../transformation";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderAtInfinity } from "./path-instruction-builder-at-infinity";

export class PathBuilderAtInfinity implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, public readonly currentPosition: PointAtInfinity){
    }
    public getPathInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderAtInfinity(infinity, this.initialPosition, this.currentPosition);
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.currentPosition.direction);
    }
    public containsFinitePoint(): boolean{
        return false;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.atInfinity(this.initialPosition, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, position, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new PathBuilderAtInfinity(this.pathBuilderProvider, transformation.applyToPointAtInfinity(this.initialPosition), transformation.applyToPointAtInfinity(this.currentPosition));
    }
}