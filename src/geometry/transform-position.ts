import { Position } from "./position";
import { Transformation } from "../transformation";
import { isPointAtInfinity } from "./is-point-at-infinity";

export function transformPosition(position: Position, transformation: Transformation): Position{
    if(isPointAtInfinity(position)){
        return {direction: transformation.untranslated().apply(position.direction)};
    }
    return transformation.apply(position);
}