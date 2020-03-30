import { StateChangingInstructionSet } from "./state-changing-instruction-set";

export interface CopyableInstructionSet extends StateChangingInstructionSet{
    copy(): CopyableInstructionSet;
}