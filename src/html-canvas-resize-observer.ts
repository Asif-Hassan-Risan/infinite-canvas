import {CanvasResizeObserver} from "./canvas-resize-observer";

export class HtmlCanvasResizeObserver implements CanvasResizeObserver{
    constructor(private readonly canvas: HTMLCanvasElement) {
    }
    addListener(listener: () => void): void {
    }

    removeListener(listener: () => void): void {
    }

}
