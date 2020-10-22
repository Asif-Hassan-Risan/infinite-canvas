import {EventTransformer} from "./event-transformer";
import {Transformation} from "../transformation";
import {InfiniteCanvasTransformationEvent} from "./infinite-canvas-transformation-event";
import { Event } from "./event";

export class TransformationEventTransformer extends EventTransformer<Transformation, InfiniteCanvasTransformationEvent>{
    constructor(sourceEvent: Event<Transformation>) {
        super(sourceEvent);
    }
    protected transformEvent(source: Transformation): InfiniteCanvasTransformationEvent {
        console.log(`creating transformation event`);
        const {a, b, c, d, e, f} = source;
        return {
            transformation: {a, b, c, d, e, f}
        };
    }
}
