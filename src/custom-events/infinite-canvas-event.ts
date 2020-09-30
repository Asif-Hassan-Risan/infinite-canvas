import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
import { InfiniteCanvasEventListener } from "./infinite-canvas-event-listener";
import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";

export interface InfiniteCanvasEvent<K extends keyof InfiniteCanvasEventMap>{
    addListener(listener: InfiniteCanvasEventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void;
    
}