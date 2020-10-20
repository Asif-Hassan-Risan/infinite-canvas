import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { InfiniteCanvasEvent } from "./infinite-canvas-event";
import {EventDispatcher} from "./event-dispatcher";

export class InfiniteCanvasEventDispatcher<K extends keyof InfiniteCanvasEventMap> extends EventDispatcher<InfiniteCanvasEventMap[K]> implements InfiniteCanvasEvent<K>{

}
