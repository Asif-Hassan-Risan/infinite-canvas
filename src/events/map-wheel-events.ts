import { Transformer } from "../transformer/transformer"
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { CanvasRectangle } from "../interfaces/canvas-rectangle";

export function mapWheelEvents(
    canvasElement: HTMLCanvasElement,
    transformer: Transformer,
    rectangle: CanvasRectangle,
    config: InfiniteCanvasConfig){
    canvasElement.addEventListener("wheel", (ev: WheelEvent) => {
        if(!config.greedyGestureHandling && !ev.ctrlKey){
            return true;
        }
        transformer.startTransformation();
        const {x, y} = rectangle.getViewboxPosition(ev.clientX, ev.clientY);
        let delta: number = ev.deltaY;
        const scale: number = Math.pow(2, -delta / 300);
        transformer.zoom(x, y, scale);
        ev.preventDefault();
        return false;
    });
}