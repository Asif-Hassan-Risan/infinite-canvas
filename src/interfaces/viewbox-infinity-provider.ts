import {ViewboxInfinity} from "./viewbox-infinity";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";

export interface ViewboxInfinityProvider {
    getInfinity(state: InfiniteCanvasState): ViewboxInfinity;
}