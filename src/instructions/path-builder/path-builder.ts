import {Instruction} from "../instruction";
import { Position } from "../../geometry/position";
import {ViewboxInfinity} from "../../interfaces/viewbox-infinity";
import {Transformation} from "../../transformation";

export interface PathBuilder{
    getLineTo(position: Position, infinity: ViewboxInfinity): Instruction;
    getMoveTo(infinity: ViewboxInfinity): Instruction;
    addPosition(position: Position): PathBuilder;
    transform(transformation: Transformation): PathBuilder;
    readonly currentPosition: Position;
}
