import {CanvasRectangle} from "./interfaces/canvas-rectangle";

export class HTMLCanvasRectangle implements CanvasRectangle{
    constructor(public width: number, public height: number) {
    }
}
