import { InfiniteCanvasPathBuilder } from "./infinite-canvas-path-builder";
import { PathBuilder } from "./path-builder";
import { PointAtInfinity } from "../../geometry/point-at-infinity";
import { ViewboxInfinity } from "../../interfaces/viewbox-infinity";
import { Instruction } from "../instruction";
import {Position} from "../../geometry/position";
import { isPointAtInfinity } from "../../geometry/is-point-at-infinity";
import { PathBuilderProvider } from "./path-builder-provider";
import { Transformation } from "../../transformation";

export class AtInfinity extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, private readonly initialPosition: PointAtInfinity, public readonly currentPosition: PointAtInfinity){
        super();
    }
    public getLineTo(position: Position, infinity: ViewboxInfinity): Instruction{
        if(isPointAtInfinity(position)){
            return undefined;
        }
        return this.lineTo(position);
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.currentPosition.direction);
    }
    public isClosable(): boolean{
        return true;
    }
    public getMoveTo(infinity: ViewboxInfinity): Instruction{
        return undefined;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            return this.pathBuilderProvider.atInfinity(this.initialPosition, position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, position, position);
    }
    public transform(transformation: Transformation): PathBuilder{
        return new AtInfinity(this.pathBuilderProvider, transformation.applyToPointAtInfinity(this.initialPosition), transformation.applyToPointAtInfinity(this.currentPosition));
    }
}