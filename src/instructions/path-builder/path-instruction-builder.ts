import { Position } from "../../geometry/position";
import { InstructionUsingInfinity } from "../instruction-using-infinity";

export interface PathInstructionBuilder{
    getLineTo(position: Position): InstructionUsingInfinity;
    getMoveTo(): InstructionUsingInfinity;
}