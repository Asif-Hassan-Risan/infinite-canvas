import {CanvasRectangle} from "../src/interfaces/canvas-rectangle";

export class MockCanvasRectangle implements CanvasRectangle{
    constructor(public viewboxWidth: number, public viewboxHeight: number) {
    }
    public measure(): void{}
}
