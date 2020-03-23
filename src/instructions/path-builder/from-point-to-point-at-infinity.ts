import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { Point } from "../../geometry/point";
import { InfiniteCanvasPathBuilder } from "./infinite-canvas-path-builder";
import { PathBuilder } from "./path-builder";
import {Position} from "../../geometry/position";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { Instruction } from "../instruction";
import { isPointAtInfinity } from "../../geometry/is-point-at-infinity";
import { Transformation } from "../../transformation";
import { PathBuilderProvider } from "./path-builder-provider";
import { instructionSequence } from "../../instruction-utils";

export class FromPointToPointAtInfinity  extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPoint: Point, public readonly currentPosition: PointAtInfinity) {
        super();
    }
    public getLineTo(position: Position, infinity: ViewboxInfinity): Instruction{
        if(isPointAtInfinity(position)){
            if(position.direction.inSameDirectionAs(this.currentPosition.direction)){
                return () => {};
            }
            if(position.direction.cross(this.currentPosition.direction) === 0){
                return this.lineToInfinityFromPointInDirection(this.initialPoint, position.direction, infinity);
            }
            return this.lineToInfinityFromInfinityFromPoint(this.initialPoint, this.currentPosition.direction, position.direction, infinity);
        }
        return instructionSequence(this.lineToInfinityFromPointInDirection(position, this.currentPosition.direction, infinity), this.lineTo(position));
    }
    public isClosable(): boolean{
        return true;
    }
    public getMoveTo(): Instruction{
        return this.moveTo(this.initialPoint);
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.fromPointToPointAtInfinity(this.initialPoint, position);
        }
        return this.pathBuilderProvider.fromPointToPoint(this.initialPoint, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new FromPointToPointAtInfinity(this.pathBuilderProvider, transformation.apply(this.initialPoint), transformation.applyToPointAtInfinity(this.currentPosition));
    }
}
