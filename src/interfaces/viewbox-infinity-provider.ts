import {ViewboxInfinity} from "./viewbox-infinity";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "../instructions/instruction";

export interface ViewboxInfinityProvider {
    getInfinity(state: InfiniteCanvasState): ViewboxInfinity;
    getPathInstructionToGoAroundViewbox(): Instruction;
}