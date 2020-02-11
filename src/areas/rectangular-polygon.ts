import { Instruction } from "../instructions/instruction";
import { ViewBoxInfinity } from "../viewbox-infinity";

export interface RectangularPolygon{
    getInstructionToDrawPath(infinity: ViewBoxInfinity): Instruction;
}