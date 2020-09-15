import {CanvasRectangle} from "./interfaces/canvas-rectangle";

export class HTMLCanvasRectangle implements CanvasRectangle{
    public pixelWidth: number;
    public pixelHeight: number;
    constructor(private readonly canvasElement: HTMLCanvasElement) {
        this.pixelWidth = canvasElement.width;
        this.pixelHeight = canvasElement.height;
    }
}
