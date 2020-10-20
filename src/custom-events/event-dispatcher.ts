import { EventListener } from "./event-listener";
import {InfiniteCanvasAddEventListenerOptions} from "./infinite-canvas-add-event-listener-options";

export class EventDispatcher<T>{
    private listeners: EventListener<T>[] = [];
    private onceListeners: EventListener<T>[] = [];
    public dispatchEvent(event: T): void{
        const onceListeners: EventListener<T>[] = this.onceListeners;
        this.onceListeners = [];
        for(const onceListener of onceListeners){
            this.notifyListener(onceListener, event);
        }
        for(const listener of this.listeners){
            this.notifyListener(listener, event);
        }
    }
    public addListener(listener: EventListener<T>, options?: InfiniteCanvasAddEventListenerOptions){
        if(options && options.once){
            this.onceListeners.push(listener);
        }else{
            this.listeners.push(listener);
        }
    }
    private notifyListener(listener: EventListener<T>, event: T): void{
        try {
            listener(event);
        } catch (error) {
            console.error(error);
        }
    }
}
