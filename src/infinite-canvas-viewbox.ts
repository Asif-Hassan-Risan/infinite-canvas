import { Transformation } from "./transformation"
import { ViewBox } from "./interfaces/viewbox";
import { Instruction } from "./instructions/instruction";
import { PathInstruction } from "./interfaces/path-instruction";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import {InfiniteCanvasStateInstance} from "./state/infinite-canvas-state-instance";
import {DrawingIterationProvider} from "./interfaces/drawing-iteration-provider";
import {InfiniteCanvasLinearGradient} from "./styles/infinite-canvas-linear-gradient";
import {InfiniteCanvasRadialGradient} from "./styles/infinite-canvas-radial-gradient";
import { DrawingLock } from "./drawing-lock";
import { InfiniteCanvasPattern } from "./styles/infinite-canvas-pattern";
import { TransformationKind } from "./transformation-kind";
import { InfiniteCanvasInstructionSet } from "./infinite-canvas-instruction-set";
import { Rectangle } from "./areas/polygons/rectangle";
import { transformInstructionRelatively } from "./instruction-utils";
import { Area } from "./areas/area";
import { Position } from "./geometry/position"
import { InfiniteCanvasViewBoxInfinity } from "./infinite-canvas-viewbox-infinity";

export class InfiniteCanvasViewBox implements ViewBox{
	private instructionSet: InfiniteCanvasInstructionSet;
	private _transformation: Transformation;
	constructor(
		public width: number,
		public height: number,
		private context: CanvasRenderingContext2D,
		private readonly drawingIterationProvider: DrawingIterationProvider,
		private readonly drawLockProvider: () => DrawingLock){
		this.instructionSet = new InfiniteCanvasInstructionSet(() => drawingIterationProvider.provideDrawingIteration(() => this.draw()), (state: InfiniteCanvasState) => new InfiniteCanvasViewBoxInfinity(this.width, this.height, state.current.transformation));
		this._transformation = Transformation.identity;
	}
	public get state(): InfiniteCanvasState{return this.instructionSet.state;}
	public get transformation(): Transformation{return this._transformation};
	public set transformation(value: Transformation){
		this._transformation = value;
		this.drawingIterationProvider.provideDrawingIteration(() => this.draw());
	}
	public getDrawingLock(): DrawingLock{
		return this.drawLockProvider();
	}
	public changeState(instruction: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void{
		this.instructionSet.changeState(instruction);
	}
	public measureText(text: string): TextMetrics{
		this.context.save();
		const changeToCurrentState: Instruction = InfiniteCanvasStateInstance.default.getInstructionToConvertToState(this.state.currentlyTransformed(false).current);
		changeToCurrentState(this.context, Transformation.identity);
		const result: TextMetrics = this.context.measureText(text);
		this.context.restore();
		return result;
	}
	public saveState(): void{
		this.instructionSet.saveState();
	}
	public restoreState(): void{
		this.instructionSet.restoreState();
	}
	public beginPath(): void{
		this.instructionSet.beginPath();
	}
	public async createPatternFromImageData(imageData: ImageData): Promise<CanvasPattern>{
		const bitmap: ImageBitmap = await createImageBitmap(imageData);
		return this.context.createPattern(bitmap, 'no-repeat');
	}
	public addDrawing(instruction: Instruction, area: Area, transformationKind: TransformationKind, takeClippingRegionIntoAccount: boolean): void{
		this.instructionSet.addDrawing(instruction, area, transformationKind, takeClippingRegionIntoAccount);
	}
	public addPathInstruction(pathInstruction: PathInstruction): void{
		this.instructionSet.addPathInstruction(pathInstruction);
	}
	public closePath(): void{
		this.instructionSet.closePath();
	}
	public moveTo(position: Position): void{
		this.instructionSet.moveTo(position);
	}
	public lineTo(position: Position): void{
		this.instructionSet.lineTo(position);
	}
	public rect(x: number, y: number, w: number, h: number): void{
		this.instructionSet.rect(x, y, w, h);
	}
	public drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
		this.instructionSet.drawPath(instruction, pathInstructions);
	}
	public drawRect(x: number, y: number, w: number, h: number, instruction: Instruction): void{
		this.instructionSet.drawRect(x, y, w, h, instruction);
	}
	private getInstructionToClearRectangle(x: number, y: number, width: number, height: number): Instruction{
		return transformInstructionRelatively((context: CanvasRenderingContext2D) => {
			context.clearRect(x, y, width, height);
		})
	}
	public clipPath(instruction: Instruction): void{
		this.instructionSet.clipPath(instruction);
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		const area: Rectangle = Rectangle.create(x, y, width, height);
		this.instructionSet.clearArea(area, this.getInstructionToClearRectangle(x, y, width, height));
	}
	public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient{
		let result: InfiniteCanvasLinearGradient;
		result = new InfiniteCanvasLinearGradient(this.context, x0, y0, x1, y1);
		return result;
	}
	public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient{
		let result: InfiniteCanvasRadialGradient;
		result = new InfiniteCanvasRadialGradient(this.context, x0, y0, r0, x1, y1, r1);
		return result;
	}
	public createPattern(image: CanvasImageSource, repetition: string): CanvasPattern{
		let result: InfiniteCanvasPattern;
		result = new InfiniteCanvasPattern(this.context.createPattern(image, repetition));
		return result;
	}
	private draw(): void{
		this.context.restore();
		this.context.save();
		this.context.clearRect(0, 0, this.width, this.height);
		this.instructionSet.execute(this.context, this._transformation);
	}
}