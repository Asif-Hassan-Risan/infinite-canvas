import { Instruction } from "../instructions/instruction";
import { ViewBoxInfinity } from "../viewbox-infinity";
import { Area } from "./area";

export interface RectangularPolygon extends Area{
    getInstructionToDrawPath(infinity: ViewBoxInfinity): Instruction;
}