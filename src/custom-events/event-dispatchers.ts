import {InfiniteCanvasEventMap} from "./infinite-canvas-event-map";
import { InfiniteCanvasEvent } from "./infinite-canvas-event";

export declare type EventDispatchers = {[K in keyof InfiniteCanvasEventMap]: InfiniteCanvasEvent<K>}