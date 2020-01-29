import { Instruction } from "../instructions/instruction";
import { AreaChange } from "../areas/area-change";

export interface PathInstruction{
    instruction: Instruction;
    changeArea: AreaChange;
}