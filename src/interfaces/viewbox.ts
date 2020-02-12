import { CurrentState } from "./current-state";
import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import { DrawingLock } from "../drawing-lock";
import { TransformationKind } from "../transformation-kind";
import { TransformableBox } from "./transformable-box";
import { Area } from "../areas/area";

export interface ViewBox extends TransformableBox, CurrentState{
    measureText(text: string): TextMetrics;
    drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void;
    addDrawing(instruction: Instruction, area: Area, transformationKind: TransformationKind, takeClippingRegionIntoAccount: boolean): void;
    createPatternFromImageData(imageData: ImageData): Promise<CanvasPattern>;
    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern;
    getDrawingLock(): DrawingLock;
    clearArea(x: number, y: number, width: number, height: number): void;
    beginPath(): void;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    clipPath(instruction: Instruction): void;
    addPathInstruction(pathInstruction: PathInstruction): void;
}