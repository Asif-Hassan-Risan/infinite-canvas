import { Instruction } from "./instruction";

export interface BoxedInstruction extends Instruction{
    replaceInnerInstructionWith(instruction: Instruction): void;
    copy(): BoxedInstruction;
}