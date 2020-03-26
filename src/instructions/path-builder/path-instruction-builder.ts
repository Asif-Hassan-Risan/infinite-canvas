import { Instruction } from "../instruction";
import { Position } from "../../geometry/position";

export interface PathInstructionBuilder{
    getLineTo(position: Position): Instruction;
    getMoveTo(): Instruction;
}