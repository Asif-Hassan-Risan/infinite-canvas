import { Position } from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Transformation} from "../../transformation";
import { PathInstructionBuilder } from "./path-instruction-builder";

export interface PathBuilder{
    getPathInstructionBuilder(infinity: ViewboxInfinity): PathInstructionBuilder;
    canAddLineTo(position: Position): boolean;
    addPosition(position: Position): PathBuilder;
    transform(transformation: Transformation): PathBuilder;
    isClosable(): boolean;
    containsFinitePoint(): boolean;
    readonly currentPosition: Position;
}
