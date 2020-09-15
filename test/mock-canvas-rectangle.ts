import {CanvasRectangle} from "../src/interfaces/canvas-rectangle";

export class MockCanvasRectangle implements CanvasRectangle{
    constructor(public pixelWidth: number, public pixelHeight: number) {
    }
}
