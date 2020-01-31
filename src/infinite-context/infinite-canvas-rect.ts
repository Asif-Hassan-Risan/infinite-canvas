import { ViewBox } from "../interfaces/viewbox";
import { Instruction } from "../instructions/instruction";
import { Rectangle } from "../areas/rectangle";

export class InfiniteCanvasRect implements CanvasRect{
    constructor(private viewBox: ViewBox){}
	public clearRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.clearArea(x, y, w, h);
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
        let instruction: Instruction = (context: CanvasRenderingContext2D) => context.fill();
        this.viewBox.drawPath(instruction, [new Rectangle(x, y, w, h).getInstructionToDrawPath()])
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
        let instruction: Instruction = (context: CanvasRenderingContext2D) => context.stroke();
        this.viewBox.drawPath(instruction, [new Rectangle(x, y, w, h).getInstructionToDrawPath()]);
    }
}
