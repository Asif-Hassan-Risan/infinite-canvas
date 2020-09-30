import { mapMouseEvents } from "./map-mouse-events";
import { Transformer } from "../transformer/transformer";
import { mapTouchEvents } from "./map-touch-events";
import { mapWheelEvents } from "./map-wheel-events";
import { Point } from "../geometry/point";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";

export class InfiniteCanvasEvents{
    constructor(canvasElement: HTMLCanvasElement, transformer: Transformer, config: InfiniteCanvasConfig){
        function getRelativePosition(clientX: number, clientY: number): Point{
            const rect: ClientRect = canvasElement.getBoundingClientRect();
            return new Point(clientX - rect.left, clientY - rect.top);
        }
        mapWheelEvents(canvasElement, transformer, getRelativePosition, config);
        mapMouseEvents(canvasElement, transformer, getRelativePosition, config);
        mapTouchEvents(canvasElement, transformer, getRelativePosition, config);
    }
}