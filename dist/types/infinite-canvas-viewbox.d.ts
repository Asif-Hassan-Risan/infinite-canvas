import { Transformation } from "./transformation";
import { ViewBox } from "./interfaces/viewbox";
import { Instruction } from "./instructions/instruction";
import { PathInstruction } from "./interfaces/path-instruction";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "./state/infinite-canvas-state-instance";
import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";
import { DrawingLock } from "./drawing-lock";
import { TransformationKind } from "./transformation-kind";
import { Area } from "./areas/area";
import { Position } from "./geometry/position";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
export declare class InfiniteCanvasViewBox implements ViewBox {
    private readonly canvasRectangle;
    private context;
    private readonly drawingIterationProvider;
    private readonly drawLockProvider;
    private readonly isTransforming;
    private instructionSet;
    constructor(canvasRectangle: CanvasRectangle, context: CanvasRenderingContext2D, drawingIterationProvider: DrawingIterationProvider, drawLockProvider: () => DrawingLock, isTransforming: () => boolean);
    get width(): number;
    get height(): number;
    get state(): InfiniteCanvasState;
    get transformation(): Transformation;
    set transformation(value: Transformation);
    getDrawingLock(): DrawingLock;
    changeState(instruction: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void;
    measureText(text: string): TextMetrics;
    saveState(): void;
    restoreState(): void;
    beginPath(): void;
    createPatternFromImageData(imageData: ImageData): Promise<CanvasPattern>;
    addDrawing(instruction: Instruction, area: Area, transformationKind: TransformationKind, takeClippingRegionIntoAccount: boolean): void;
    addPathInstruction(pathInstruction: PathInstruction): void;
    closePath(): void;
    moveTo(position: Position): void;
    lineTo(position: Position): void;
    rect(x: number, y: number, w: number, h: number): void;
    currentPathCanBeFilled(): boolean;
    fillPath(instruction: Instruction): void;
    strokePath(): void;
    fillRect(x: number, y: number, w: number, h: number, instruction: Instruction): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    clipPath(instruction: Instruction): void;
    clearArea(x: number, y: number, width: number, height: number): void;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern;
    draw(): void;
}
