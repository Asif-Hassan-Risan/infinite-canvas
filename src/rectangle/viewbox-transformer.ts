import { ConvexPolygon } from "../areas/polygons/convex-polygon";
import { Instruction } from "../instructions/instruction";

export interface ViewboxTransformer {
    getTransformedViewbox(margin: number): ConvexPolygon;
    addPathAroundViewbox(context: CanvasRenderingContext2D, margin: number): void;
    transformRelatively(instruction: Instruction): Instruction;
    transformAbsolutely(instruction: Instruction): Instruction;
}