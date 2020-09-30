import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";


export declare type InfiniteCanvasEventListener<K extends keyof InfiniteCanvasEventMap> = (ev: InfiniteCanvasEventMap[K]) => any;