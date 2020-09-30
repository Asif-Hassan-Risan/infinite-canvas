import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { InfiniteCanvasEventListener } from "./infinite-canvas-event-listener";
import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
import { InfiniteCanvasEvent } from "./infinite-canvas-event";

export class InfiniteCanvasEventDispatcher<K extends keyof InfiniteCanvasEventMap> implements InfiniteCanvasEvent<K>{
    private listeners: InfiniteCanvasEventListener<K>[] = [];
    private onceListeners: InfiniteCanvasEventListener<K>[] = [];
    public dispatchEvent(event: InfiniteCanvasEventMap[K]): void{
        const onceListeners: InfiniteCanvasEventListener<K>[] = this.onceListeners;
        this.onceListeners = [];
        for(const onceListener of onceListeners){
            this.notifyListener(onceListener, event);
        }
        for(const listener of this.listeners){
            this.notifyListener(listener, event);
        }
    }
    public addListener(listener: InfiniteCanvasEventListener<K>, options?: InfiniteCanvasAddEventListenerOptions){
        if(options && options.once){
            this.onceListeners.push(listener);
        }else{
            this.listeners.push(listener);
        }
    }
    private notifyListener(listener: InfiniteCanvasEventListener<K>, event: InfiniteCanvasEventMap[K]): void{
        try {
            listener(event);
        } catch (error) {
            console.error(error);
        }
        
    }
}