import { InstructionSet } from "../src/interfaces/instruction-set";
import { logInstruction } from "./log-instruction";
import { Transformation } from "../src/transformation";

export function logInstructionSet(instructionSet: InstructionSet): string[]{
    return logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
        (<any>instructionSet).execute(context, transformation, true);
    });
}