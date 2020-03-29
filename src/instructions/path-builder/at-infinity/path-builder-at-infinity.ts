import { PathBuilder } from "../path-builder";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { ViewboxInfinity } from "../../../interfaces/viewbox-infinity";
import {Position} from "../../../geometry/position";
import { isPointAtInfinity } from "../../../geometry/is-point-at-infinity";
import { PathBuilderProvider } from "../path-builder-provider";
import { Transformation } from "../../../transformation";
import { PathInstructionBuilder } from "../path-instruction-builder";
import { PathInstructionBuilderAtInfinity } from "./path-instruction-builder-at-infinity";
import { InfiniteCanvasPathBuilder } from "../infinite-canvas-path-builder";
import { PathInfinityProvider } from "../../../interfaces/path-infinity-provider";

export class PathBuilderAtInfinity extends InfiniteCanvasPathBuilder implements PathBuilder{
    constructor(private readonly pathBuilderProvider: PathBuilderProvider, infinityProvider: PathInfinityProvider, private readonly initialPosition: PointAtInfinity, private readonly _containsFinitePoint: boolean, private readonly positionsSoFar: PointAtInfinity[], public readonly currentPosition: PointAtInfinity){
        super(infinityProvider);
    }
    protected getInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder{
        return new PathInstructionBuilderAtInfinity(infinity, this.initialPosition, this.infinityProvider, this._containsFinitePoint, this.positionsSoFar, this.currentPosition);
    }
    public canAddLineTo(position: Position): boolean{
        return !isPointAtInfinity(position) || !position.direction.isInOppositeDirectionAs(this.currentPosition.direction);
    }
    public containsFinitePoint(): boolean{
        return this._containsFinitePoint;
    }
    public isClosable(): boolean{
        return true;
    }
    public addPosition(position: Position): PathBuilder{
        if(isPointAtInfinity(position)){
            const newDirectionOnSameSideAsOrigin: boolean = position.direction.isOnSameSideOfOriginAs(this.initialPosition.direction, this.currentPosition.direction);
            const newContainsFinitePoint: boolean = newDirectionOnSameSideAsOrigin ? this._containsFinitePoint : !this._containsFinitePoint;
            return this.pathBuilderProvider.atInfinity(this.initialPosition, newContainsFinitePoint, this.positionsSoFar.concat([position]), position);
        }
        return this.pathBuilderProvider.fromPointAtInfinityToPoint(this.initialPosition, position, position);
    }
    protected transform(transformation: Transformation): InfiniteCanvasPathBuilder{
        return new PathBuilderAtInfinity(
            this.pathBuilderProvider, 
            this.infinityProvider,
            transformation.applyToPointAtInfinity(this.initialPosition),
            this._containsFinitePoint,
            this.positionsSoFar.map(p => transformation.applyToPointAtInfinity(p)),
            transformation.applyToPointAtInfinity(this.currentPosition));
    }
}