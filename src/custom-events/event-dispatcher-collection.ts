import {InfiniteCanvasEventMap} from "./infinite-canvas-event-map";
import { EventListener } from "./event-listener";
import {InfiniteCanvasAddEventListenerOptions} from "./infinite-canvas-add-event-listener-options";
import {InfiniteCanvasDrawEvent} from "./infinite-canvas-draw-event";
import {Transformation} from "../transformation";
import {InfiniteCanvasTransformationEvent} from "./infinite-canvas-transformation-event";
import { Event } from "./event";
import {TransformationEventTransformer} from "./transformation-event-transformer";

export class EventDispatcherCollection{
    private transformationStartEvent: Event<InfiniteCanvasTransformationEvent>;
    private transformationChangeEvent: Event<InfiniteCanvasTransformationEvent>;
    private transformationEndEvent: Event<InfiniteCanvasTransformationEvent>;
    constructor(
        private readonly drawEvent: Event<InfiniteCanvasDrawEvent>,
        transformationStartEvent: Event<Transformation>,
        transformationChangeEvent: Event<Transformation>,
        transformationEndEvent: Event<Transformation>) {
            this.transformationStartEvent = new TransformationEventTransformer(transformationStartEvent);
            this.transformationChangeEvent = new TransformationEventTransformer(transformationChangeEvent);
            this.transformationEndEvent = new TransformationEventTransformer(transformationEndEvent);
    }
    public addEventListener<K extends keyof InfiniteCanvasEventMap>(event: K, listener: EventListener<InfiniteCanvasEventMap[K]>, options?: InfiniteCanvasAddEventListenerOptions){
        switch (event) {
            case "draw": {
                this.drawEvent.addListener(listener, options);
                break;
            }
            case "transformationChange": {
                this.transformationChangeEvent.addListener(listener, options)
                break;
            }
        }
    }

    public removeEventListener<K extends keyof InfiniteCanvasEventMap>(event: K, listener: EventListener<InfiniteCanvasEventMap[K]>){
        switch (event) {
            case "draw": {
                this.drawEvent.removeListener(listener);
                break;
            }
            case "transformationChange": {
                this.transformationChangeEvent.removeListener(listener)
                break;
            }
        }
    }
}
