import {Instruction} from "../instruction";
import { Position } from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Transformation} from "../../transformation";

export interface PathBuilder{
    getLineTo(position: Position, infinity: ViewboxInfinity): Instruction;
    canAddLineTo(position: Position): boolean;
    getMoveTo(infinity: ViewboxInfinity): Instruction;
    addPosition(position: Position): PathBuilder;
    transform(transformation: Transformation): PathBuilder;
    isClosable(): boolean;
    readonly currentPosition: Position;
}
