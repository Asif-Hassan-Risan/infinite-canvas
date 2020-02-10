import { ViewBox } from "../interfaces/viewbox";
import { PathInstructions } from "../instructions/path-instructions";
import { Rectangle } from "../areas/rectangle";
import { AreaBuilder } from "../areas/area-builder";
import { Instruction } from "../instructions/instruction";

export class InfiniteCanvasPath implements CanvasPath{
	constructor(private viewBox: ViewBox){}
	public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.viewBox.addPathInstruction(PathInstructions.arc(x, y, radius, startAngle, endAngle, anticlockwise))
	}
	public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{
		this.viewBox.addPathInstruction(PathInstructions.arcTo(x1, y1, x2, y2, radius));
	}
	public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{}
	public closePath(): void{
		this.viewBox.addPathInstruction(PathInstructions.closePath());
	}
	public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.viewBox.addPathInstruction(PathInstructions.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise));
	}
	public lineTo(_x: number, _y: number): void{
		this.viewBox.addPathInstruction(PathInstructions.lineTo(_x, _y));
	}
	public moveTo(_x: number, _y: number): void{
		this.viewBox.addPathInstruction(PathInstructions.moveTo(_x, _y));
	}
	public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{}

	public rect(x: number, y: number, w: number, h: number): void{
		const rectangleToDraw: Rectangle = Rectangle.create(x, y, w, h);
		const instructionToDrawRectangularPath: Instruction = this.viewBox.getInstructionToDrawRectangularPath(rectangleToDraw);
		this.viewBox.addPathInstruction({
			instruction: instructionToDrawRectangularPath,
			changeArea: (builder: AreaBuilder) => builder.addRectangle(rectangleToDraw)
		});
	}
}