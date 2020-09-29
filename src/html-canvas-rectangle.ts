import {CanvasRectangle} from "./interfaces/canvas-rectangle";

export class HTMLCanvasRectangle implements CanvasRectangle{
    public viewboxWidth: number;
    public viewboxHeight: number;
    constructor(private readonly canvasElement: HTMLCanvasElement) {
        this.measure();
    }
    public measure(): void{
        console.log(`measuring viewbox`);
        this.viewboxWidth = this.canvasElement.width;
        this.viewboxHeight = this.canvasElement.height;
    }
}
