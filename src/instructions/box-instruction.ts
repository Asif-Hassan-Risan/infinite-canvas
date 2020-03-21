import { Instruction } from "./instruction";
import { BoxedInstruction } from "./boxed-instruction";
import { Transformation } from "../transformation";

export function boxInstruction(instruction: Instruction): BoxedInstruction{
    const result: BoxedInstruction = <BoxedInstruction>((context: CanvasRenderingContext2D, transformation: Transformation) => {
        instruction(context, transformation);
    });
    result.replaceInnerInstructionWith = (newInstruction: Instruction) => instruction = newInstruction;
    result.copy = () => boxInstruction(instruction);
    return result;
}