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
import { transformInstructionRelatively } from "./instruction-utils";
import { Area } from "./areas/area";
import { Position } from "./geometry/position"
import {ConvexPolygon} from "./areas/polygons/convex-polygon";
import {Point} from "./geometry/point";
import { Rectangle } from "./interfaces/rectangle";
import { plane } from "./areas/plane";
import {InfiniteCanvasViewboxInfinityProvider} from "./infinite-canvas-viewbox-infinity-provider";
import {ViewboxInfinity} from "./interfaces/viewbox-infinity";

export class InfiniteCanvasViewBox implements ViewBox{
	private instructionSet: InfiniteCanvasInstructionSet;
	private infinityProvider: InfiniteCanvasViewboxInfinityProvider;
	private _transformation: Transformation;
	constructor(
		public width: number,
		public height: number,
		private context: CanvasRenderingContext2D,
		private readonly drawingIterationProvider: DrawingIterationProvider,
		private readonly drawLockProvider: () => DrawingLock){
		this.infinityProvider = new InfiniteCanvasViewboxInfinityProvider(width, height);
		this.instructionSet = new InfiniteCanvasInstructionSet(() => drawingIterationProvider.provideDrawingIteration(() => this.draw()), this.infinityProvider);
		this._transformation = Transformation.identity;
	}
	public get state(): InfiniteCanvasState{return this.instructionSet.state;}
	public get transformation(): Transformation{return this._transformation};
	public set transformation(value: Transformation){
		this._transformation = value;
		this.infinityProvider.viewBoxTransformation = value;
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
		if(this.instructionSet.canAddLineTo(position)){
			this.instructionSet.lineTo(position);
		}
	}
	public rect(x: number, y: number, w: number, h: number): void{
		this.instructionSet.rect(x, y, w, h);
	}
	public currentSubpathIsClosable(): boolean{
		return this.instructionSet.currentSubpathIsClosable();
	}
	public allSubpathsAreClosable(): boolean{
		return this.instructionSet.allSubpathsAreClosable();
	}
	public drawPath(instruction: Instruction): void{
		this.infinityProvider.addDrawnLineWidth(this.state.current.lineWidth * this.state.current.transformation.getMaximumLineWidthScale());
		this.instructionSet.drawPath(instruction);
	}
	public drawRect(x: number, y: number, w: number, h: number, instruction: Instruction): void{
		this.infinityProvider.addDrawnLineWidth(this.state.current.lineWidth * this.state.current.transformation.getMaximumLineWidthScale());
		this.instructionSet.drawRect(x, y, w, h, instruction);
	}
	private getFiniteRectangle(x: number, y: number, width: number, height: number, infinity: ViewboxInfinity): (transformation: Transformation) => Rectangle{
		const xStart: (transformation: Transformation) => number = Number.isFinite(x) ? () => x : (transformation: Transformation) => transformation.inverse().apply(infinity.getInfinityFromPointInDirection(new Point(0, 0), new Point(-1, 0))).x;
		const xEndDirection: Point = width > 0 ? new Point(1, 0) : new Point(-1, 0);
		const xEnd: (transformation: Transformation) => number = Number.isFinite(width) ? () => x + width : (transformation: Transformation) => transformation.inverse().apply(infinity.getInfinityFromPointInDirection(new Point(0, 0), xEndDirection)).x;
		const yStart: (transformation: Transformation) => number = Number.isFinite(y) ? () => y : (transformation: Transformation) => transformation.inverse().apply(infinity.getInfinityFromPointInDirection(new Point(0, 0), new Point(0, -1))).y;
		const yEndDirection: Point = height > 0 ? new Point(0, 1) : new Point(0, -1);
		const yEnd: (transformation: Transformation) => number = Number.isFinite(height) ? () => y + height : (transformation: Transformation) => transformation.inverse().apply(infinity.getInfinityFromPointInDirection(new Point(0, 0), yEndDirection)).y;
		return (transformation: Transformation) => {
			const _xStart: number = xStart(transformation);
			const _xEnd: number = xEnd(transformation);
			const _yStart: number = yStart(transformation);
			const _yEnd: number = yEnd(transformation);
			return {
				x: _xStart,
				width: _xEnd - _xStart,
				y: _yStart,
				height: _yEnd - _yStart
			};
		};
	}
	private getInstructionToClearRectangle(x: number, y: number, width: number, height: number): Instruction{
		const infinity: ViewboxInfinity = this.infinityProvider.getInfinity(this.state);
		const finiteRectangle: (transformation: Transformation) => Rectangle = this.getFiniteRectangle(x, y, width, height, infinity);
		return transformInstructionRelatively((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y, width, height} = finiteRectangle(transformation);
			context.clearRect(x, y, width, height);
		});
	}
	public clipPath(instruction: Instruction): void{
		this.instructionSet.clipPath(instruction);
	}
	private lineSegmentHasLength(start: number, length: number): boolean{
		if(Number.isFinite(start)){
			return true;
		}
		if(Number.isFinite(length)){
			return false;
		}
		return start < 0 && length > 0;
	}
	private lineSegmentIsLine(start: number, length: number): boolean{
		return !Number.isFinite(start) && start < 0 && !Number.isFinite(length) && length > 0;
	}
	private rectangleHasArea(x: number, y: number, width: number, height: number): boolean{
		return this.lineSegmentHasLength(x, width) && this.lineSegmentHasLength(y, height);
	}
	private rectangleIsPlane(x: number, y: number, width: number, height: number): boolean{
		return this.lineSegmentIsLine(x, width) && this.lineSegmentIsLine(y, height);
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		if(!this.rectangleHasArea(x, y, width, height)){
			return;
		}
		const area: Area = this.rectangleIsPlane(x, y, width, height) ? plane : ConvexPolygon.createRectangle(x, y, width, height);
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