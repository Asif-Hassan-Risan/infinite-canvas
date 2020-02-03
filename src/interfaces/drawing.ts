import { PartOfDrawing } from "./part-of-drawing";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Area } from "../areas/area";
import { Rectangle } from "../areas/rectangle";

export interface Drawing extends PartOfDrawing{
    clearContentsInsideArea(area: Area): void;
    addClearRect(area: Rectangle, state: InfiniteCanvasState): void;
}
