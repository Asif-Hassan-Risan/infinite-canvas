import { PartOfDrawing } from "./part-of-drawing";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Rectangle } from "../areas/rectangle";

export interface Drawing extends PartOfDrawing{
    clearContentsInsideArea(area: Rectangle): void;
    addClearRect(area: Rectangle, state: InfiniteCanvasState): void;
}
